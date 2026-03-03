"use client";

export function useConfetti() {
  const fire = async () => {
    try {
      if (sessionStorage.getItem("confetti_fired")) return;
      sessionStorage.setItem("confetti_fired", "1");
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.72 },
        colors: ["#487877", "#cb6a3f", "#f5f3ef", "#37474b", "#a8c5c4"],
        ticks: 200,
        gravity: 1.2,
        scalar: 0.85,
      });
    } catch {}
  };

  return { fire };
}
