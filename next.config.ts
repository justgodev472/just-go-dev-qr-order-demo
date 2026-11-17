import type { NextConfig } from "next";

/**
 * Next.js dev จะบล็อก request ไปที่ /_next/* ถ้า Origin ไม่ใช่ localhost
 * (ดู block-cross-site-dev) ทำให้เปิดผ่าน IP ในวง LAN แล้ว hydrate ไม่ขึ้น
 * คลิกอะไรก็ไม่ติด — ต้องใส่ host/IP ใน allowedDevOrigins
 *
 * scripts/dev-lan.cjs จะเซ็ต DEV_LAN_ORIGINS เป็น IP จริงของเครื่องให้อัตโนมัติ
 * (รวม 127.0.0.1 เพราะ Next ไม่ได้ allow ให้เอง) จึงไม่ต้องแก้ไฟล์นี้เวลา IP เปลี่ยน
 */
const lanOrigins = (process.env.DEV_LAN_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    "localhost", 
    "127.0.0.1", 
    "[::1]", 
    "http://172.24.128.1:6003", ...lanOrigins
  ],
};

export default nextConfig;
