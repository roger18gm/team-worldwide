// src/js/alerts.ts
type AlertItem = { message: string; background: string; color: string };

export default class Alert {
  constructor(private path = "/json/alerts.json") {}

  async init(): Promise<void> {
    const res = await fetch(this.path);
    if (!res.ok) return;
    const alerts: AlertItem[] = await res.json();
    if (!alerts.length) return;

    const section = document.createElement("section");
    section.className = "alert-list";

    for (const item of alerts) {
      const p = document.createElement("p");
      p.textContent = item.message;
      p.style.backgroundColor = item.background;
      p.style.color = item.color;
      section.append(p);
    }

    document.querySelector("main")?.prepend(section);
  }
}