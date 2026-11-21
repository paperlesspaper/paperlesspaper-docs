import warning from "./experimental-warning.module.css";

export function ExperimentalPanelWarning() {
  return (
    <aside className={`not-prose ${warning.banner}`} aria-labelledby="experimental-panel-warning">
      <img className={warning.sign} src="/panels/experimental-warning-yellow-frame.webp" width={460} height={588} alt="" />
      <div className={warning.copy}>
        <strong className={warning.title} id="experimental-panel-warning">Experimental panel tests</strong>
        <p>Changing how the controller drives the display can permanently damage or destroy your panel.</p>
        <p>If you have questions, <a href="https://paperlesspaper.de/en/posts/contact">write us before testing</a>.</p>
      </div>
    </aside>
  );
}
