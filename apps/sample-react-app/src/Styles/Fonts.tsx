import { Global } from "@emotion/react";
import React from "react";

export const Fonts = (): React.ReactElement => (
  <Global
    styles={`
    @font-face {
      font-family: "Inter";
      src: local("./fonts/Inter-Light.woff2") format("woff2");
      font-weight: 300;
      font-style: normal;
    }
    
    @font-face {
      font-family: "Inter";
      src: local("./fonts/Inter-Regular.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
    }
    
    @font-face {
      font-family: "Inter";
      src: local("./fonts/Inter-Medium.woff2") format("woff2");
      font-weight: 500;
      font-style: normal;
    }
    
    @font-face {
      font-family: "Inter";
      src: local("./fonts/Inter-Bold.woff2") format("woff2");
      font-weight: 700;
      font-style: normal;
    }
    
    @font-face {
      font-family: "JetBrains Mono";
      src: local("./fonts/JetBrainsMono-Light.woff2") format("woff2");
      font-weight: 300;
      font-style: normal;
    }
    
    @font-face {
      font-family: "JetBrains Mono";
      src: local("./fonts/JetBrainsMono-Regular.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
    }
    
    @font-face {
      font-family: "JetBrains Mono";
      src: local("./fonts/JetBrainsMono-Bold.woff2") format("woff2");
      font-weight: 700;
      font-style: normal;
    }
    
    @font-face {
      font-family: "JetBrains Mono";
      src: local("./fonts/JetBrainsMono-ExtraBold.woff2") format("woff2");
      font-weight: 800;
      font-style: normal;
    }
      `}
  />
);
