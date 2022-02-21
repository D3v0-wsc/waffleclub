import {Images} from "./Images";
import * as THREE from "three";
// @ts-ignore
import FOG from "vanta/dist/vanta.fog.min"
import {useEffect, useRef, useState} from "react";
import {LightRed, OffWhite, Red, YellowCream} from "../consts";

export const Hero = ({artworks}: { artworks: string[] }) => {
  const [vantaEffect, setVantaEffect] = useState(0)

  const vantaRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(FOG({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        highlightColor: LightRed,
        midtoneColor: YellowCream,
        lowlightColor: OffWhite,
        baseColor: Red,
        blurFactor: 0.5,
        speed: 0.6,
      }))
    }
    return () => {
      if (vantaEffect) { // @ts-ignore
        vantaEffect.destroy()
      }
    }
  }, [vantaEffect])
  return <>

    <section ref={vantaRef} style={{
      height: "100vh",
      minHeight: '1080px',
      backgroundColor: "#f5d8ad",
      backgroundPosition: "bottom",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}>
      <h1 style={{fontSize: "35pt", marginTop: '125px', color: YellowCream, fontWeight: "bold"}}>Have a bite!</h1>
      <Images sources={artworks}/>
      <div style={{
        paddingBottom: '250px',
      }}>
        <h2>Join the Waffle Social Club</h2>
        <h3></h3>
      </div>
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        transform: 'translateY(20%)',
        width: '100%',
        height: '263px',
        background: `url('/chantilly.pat.png')`,
      }}/>
    </section>

  </>;
}
