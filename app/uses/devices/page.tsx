import { UsesItem, UsesList } from "@/components/uses-item";

export default function DevicesPage() {
  return (
    <UsesList>
      <UsesItem name="MacBook Pro 16&quot; M1 Max" description="2021" />
      <UsesItem name="iPhone 14 Pro" href="https://www.apple.com/iphone/" />
      <UsesItem name="AirPods Pro 1" href="https://www.apple.com/airpods-pro/" />
      <UsesItem name="Whoop 4.0" href="https://www.whoop.com" description="Fitness tracker" />
      <UsesItem name="Sony WH-1000XM4" href="https://www.sony.com/en/headphones/headband/wh-1000xm4" description="Noise-cancelling headphones" />
      <UsesItem name="Garmin Venu 1" href="https://www.garmin.com" description="GPS smartwatch" />
      <UsesItem name="Asus Zenbook 3" description="Secondary laptop" />
      <UsesItem name="Raspberry Pi 2" href="https://www.raspberrypi.com" description="Home server" />
      <UsesItem name="Adidas Boston 13" href="https://www.adidas.com/us/adizero-boston-13" description="Running shoes" />
    </UsesList>
  );
}
