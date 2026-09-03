import { BatteryCharging, Camera, Flame, RadioTower, ScanFace, ShieldCheck, Wrench } from "lucide-react";

export function CategoryIcon({ icon, size = 28 }: { icon: string; size?: number }) {
  const props = { size, strokeWidth: 1.8 };
  if (icon === "flame") return <Flame {...props} />;
  if (icon === "camera") return <Camera {...props} />;
  if (icon === "battery") return <BatteryCharging {...props} />;
  if (icon === "scan") return <ScanFace {...props} />;
  if (icon === "radio") return <RadioTower {...props} />;
  if (icon === "tool") return <Wrench {...props} />;
  return <ShieldCheck {...props} />;
}
