import { useEffect, useRef } from "react";

export default function VideoconfEmbed({
  onRoomReady = () => {},
  token,
  user,
}) {
  const container = useRef(null);

  window.setupRoomSession = (rs) => {
    onRoomReady(rs);
  };

  useEffect(() => {
    if (container.current === null) return;

    const c = container.current;
    const script = document.createElement("script");
    script.innerHTML = `
  !function(e,r){e.swvr=e.swvr||function(r={}){
  Object.assign(e.swvr.p=e.swvr.p||{},r)}
  ;let t=r.currentScript,n=r.createElement("script")
  ;n.type="module",n.src="https://cdn.signalwire.com/video/rooms/index.js",
  n.onload=function(){let n=r.createElement("ready-room")
  ;n.params=e.swvr.p,t.parentNode.appendChild(n)},t.parentNode.insertBefore(n,t)
  ;let i=r.createElement("link")
  ;i.type="text/css",i.rel="stylesheet",i.href="https://cdn.signalwire.com/video/rooms/signalwire.css",
  t.parentNode.insertBefore(i,t),
  e.SignalWire=e.SignalWire||{},e.SignalWire.Prebuilt={VideoRoom:e.swvr}
  }(window,document);

  SignalWire.Prebuilt.VideoRoom({
    // token: 'vpt_22bd83e329d34a2ccd083fe90b0dadfd',
    token: '${token}',
    userName: '${user}',
     setupRoomSession: (rs)=>{
        if (window.setupRoomSession !== undefined) window.setupRoomSession(rs); 
     }
  });
    `;

    c.appendChild(script);
    return () => {
      c.innerHTML = '';
    };
  }, []);
  return <div ref={container} style={{
    maxHeight: 'calc(100vh - 90px)',
    aspectRatio: '16 / 9',
    flex: 1
  }}></div>;
}
