"use client";

import { useEffect, useRef } from "react";

/**
 * ให้ปุ่ม back ของมือถือ "ปิด" dialog / bottom sheet ก่อน แทนการย้อน URL
 *
 * วิธีทำงาน: ตอนเปิด sheet จะ push history entry กันไว้ 1 ชั้น
 * - ผู้ใช้กด back → popstate → เรียก onClose (ไม่เปลี่ยนหน้า)
 * - ผู้ใช้ปิดด้วย X / แตะฉากหลัง → cleanup จะถอด entry ที่กันไว้ออกให้
 *   เพื่อไม่ให้ประวัติการกด back ค้างเกินหนึ่งครั้ง
 */
const GUARD_KEY = "__dshSheetGuard";

export function useBackToClose(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    const openedPath = window.location.pathname + window.location.search;
    const baseState = window.history.state ?? {};
    window.history.pushState({ ...baseState, [GUARD_KEY]: true }, "");

    let closedByBack = false;
    const handlePop = () => {
      closedByBack = true;
      onCloseRef.current();
    };
    window.addEventListener("popstate", handlePop);

    return () => {
      window.removeEventListener("popstate", handlePop);
      if (closedByBack) return;

      // หน่วงให้ router (กรณีกด Link ในชีต) push history ให้เสร็จก่อน
      // ถ้ามีการนำทางไปหน้าอื่นแล้ว = ไม่ต้องถอด entry (ไม่งั้นจะไปยกเลิกการนำทาง)
      setTimeout(() => {
        const stillSamePage =
          window.location.pathname + window.location.search === openedPath;
        if (stillSamePage && window.history.state?.[GUARD_KEY]) {
          window.history.back();
        }
      }, 150);
    };
  }, [isOpen]);
}
