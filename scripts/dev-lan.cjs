/* eslint-disable @typescript-eslint/no-require-imports -- สคริปต์ Node (CommonJS) ที่โหลดผ่าน --require */
/**
 * Dev-only helper: ทำให้ `next dev` โชว์ IP ของ Wi-Fi/Ethernet แทน IP ของ
 * adapter เสมือน (WSL / Hyper-V vEthernet 172.x) ที่มือถือในวงเดียวกันเข้าไม่ถึง
 *
 * Next.js หา "Network URL" จาก getNetworkHost() = IPv4 ตัวแรกที่เจอใน
 * os.networkInterfaces() ซึ่งบนเครื่องที่มี WSL จะได้ vEthernet(172.24.128.1) ก่อน
 * ไฟล์นี้จึงซ่อน adapter เสมือนออกจากการค้นหา เพื่อให้ Next เลือก IP จริงเอง
 * (ตัวเซิร์ฟเวอร์ยังฟังที่ 0.0.0.0 เหมือนเดิม → localhost และ LAN ใช้ได้ทั้งคู่)
 *
 * ใช้ผ่าน: node --require ./scripts/dev-lan.cjs node_modules/next/dist/bin/next dev -p 6003
 */
const os = require("node:os");

// ชื่อ adapter ที่ไม่ใช่เน็ตเวิร์กจริงของเครื่อง (เข้าได้แค่ในเครื่อง/VM)
const VIRTUAL_ADAPTER =
  /(vEthernet|WSL|Hyper-?V|VirtualBox|VMware|Docker|Loopback|Tailscale|ZeroTier|Bluetooth|Wi-?Fi\s*Direct|Teredo|isatap)/i;

const originalNetworkInterfaces = os.networkInterfaces.bind(os);

os.networkInterfaces = function networkInterfacesWithoutVirtualAdapters() {
  const all = originalNetworkInterfaces();
  const physical = {};

  for (const [name, addresses] of Object.entries(all)) {
    if (VIRTUAL_ADAPTER.test(name)) continue;
    physical[name] = addresses;
  }

  // ถ้ากรองแล้วไม่เหลืออะไรเลย (เช่นเครื่องมีแต่ adapter เสมือน) ใช้ค่าเดิม
  return Object.keys(physical).length > 0 ? physical : all;
};

// ให้ next.config.ts เอา IP ของเครื่องนี้ไปใส่ allowedDevOrigins
// (Next dev บล็อก /_next/* ที่มาจาก origin อื่นที่ไม่ใช่ localhost → เปิดผ่าน IP แล้ว hydrate ไม่ขึ้น)
const lanAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((entry) => entry && entry.family === "IPv4" && !entry.internal)
  .map((entry) => entry.address);

process.env.DEV_LAN_ORIGINS = [...new Set(lanAddresses)].join(",");
