import React, {useEffect, useRef, useState} from "react";
import {getDocument, GlobalWorkerOptions, version} from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

const Roadmap = () => {
  let renderedPdf;
  const pageRenderRef = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null);
  //const pageRenderRef = useRef(null);
  const DEFAULT_SCALE = 1;
  const [progressTxt, setprogressTxt] = useState("");

  useEffect(() => {
    console.log("load PDF");
    getPDFData();
  });

  const getPDFData = () => {
    // can be web URL
    const url = "/Litepaper_WSC-SQ.pdf";
    downloadPDFFromURL(url);
  };

  const downloadPDFFromURL = (url: any) => {
    const xhrObj = new XMLHttpRequest();
    xhrObj.open("GET", url, true);
    xhrObj.responseType = "blob";

    xhrObj.addEventListener("loadstart", loadStartFunction, false);
    //xhrObj.addEventListener("progress", progressFunction, false);
    xhrObj.addEventListener("error", downloadError, false);
    xhrObj.addEventListener("timeout", downloadTimeout, false);
    xhrObj.addEventListener("abort", downloadAbort, false);

    xhrObj.onreadystatechange = async (event) => {
      try {
        if (xhrObj && xhrObj.status === 400) {
          console.log("download error");
        } else {
          if (xhrObj && xhrObj.readyState === XMLHttpRequest.DONE) {
            console.log("download complete");
            const pdfData = await convertBlobToBase64(xhrObj.response);
            loadPDFWithBlob(pdfData);
          }
        }
      } catch (error) {
        console.error("File upload exception: ", error);
      }
    };

    xhrObj.send(null);
  };

  const loadStartFunction = (event: any) => {
    console.log("File download started");
  };

/*
  const progressFunction = async (event: { lengthComputable: any; loaded: number; total: number; }) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100) + "%";
        setprogressTxt(progress);
      }
    }; */

  const downloadError = () => {
    console.log("Network Error!");
  };

  const downloadTimeout = () => {
    console.log("Network Timeout!");
  };

  const downloadAbort = () => {
    console.log("Upload Aborted!");
  };

  const loadPDFWithBlob = (pdfData: any) => {
    const encodedPDF = pdfData;
    const encodedData = encodedPDF.split(",");
    if (encodedData[1] !== undefined) {
      const pdfbase64 = atob(encodedData[1]);
      showPDFInCanvas(pdfbase64);
    }
  };

  const showPDFInCanvas = async (pdfData: string) => {
    const loadingTask = getDocument({data: pdfData});
    await loadingTask.promise.then(
      (pdf: any) => {
        renderedPdf = pdf;
        const container = pageRenderRef.current;
        const pageNo = 0;
        fetchPageNo(pageNo, renderedPdf, container);
      },
      (error: string) => {
        console.log("PDF error");
      }
    );
  };

  const fetchPageNo = async (pageNo: any, pdf: any, container: any) => {
    if (pageNo < pdf._pdfInfo.numPages) {
      pageNo += 1;
      console.log(pageNo);
      createContextForCanvas(pdf, container, pageNo).then((page) => {
        fetchPageNo(page, pdf, container);
      });
    }
  };

  const createContextForCanvas = async (pdf: { getPage: (arg0: any) => Promise<any>; }, container: any, pageNo: any) => {
    return new Promise((resolve) => {
      pdf.getPage(pageNo).then(async (page) => {
        const viewport = page.getViewport({scale: DEFAULT_SCALE});

        /*
                let canvasInHTML = {
                  canvas,
                  ctx: undefined
                };
                */


        /*
        const canvasInHTML = useRef<HTMLCanvasElement>(null);
        const [ctx, setContext] = React.useState<CanvasRenderingContext2D | null>(null);

        useEffect(() => {
            if (canvasInHTML.current) {
              const ctx = canvasInHTML.current.getContext('2d');

              if (ctx) {
                setContext(ctx);
              }
            }
          }, [ctx]);

        /*
        const canvasInHTML = React.useRef<HTMLCanvasElement>(null);

        const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(null);
        const renderCtx = canvasInHTML.current.getContext('2d');

        useEffect(() => {
            if (canvasInHTML.current) {
              const renderCtx = canvasInHTML.current.getContext('2d');

              if (renderCtx) {
                setContext(renderCtx);
              }
            }
          }, [context]);
          */
        /*
        const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

        const canvas = canvasInHTML.current;
          useEffect(() => {
            if (canvasInHTML.current) {
                const canvas = canvasInHTML.current;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    setContext(ctx);
                  }
            }
        }, [context]);

        const test = context

        //const canvasInHTML.canvas = React.useRef<HTMLCanvasElement>(null);
        */
        let canvasInHTML = {
          canvas: undefined as any,
          ctx: undefined as any
        };

        const li = document.createElement("div");
        li.setAttribute("id", "page-" + (page._pageIndex + 1));
        li.setAttribute("style", "position: relative;");

        canvasInHTML.canvas = document.createElement("canvas");
        canvasInHTML.ctx = canvasInHTML.canvas.getContext("2d");

        canvasInHTML.canvas.height = viewport.height;
        canvasInHTML.canvas.width = viewport.width;
        //let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        //let ctx = canvas.getContext("2d");
        //canvas.height = viewport.height;
        //canvas.width = viewport.width;

        li.appendChild(canvasInHTML.canvas);
        container.appendChild(li);

        const renderContext = {
          canvasContext: canvasInHTML.ctx,
          viewport
        };

        let renderTask = page.render(renderContext);

        renderTask.promise.then(() => {
          if (pageNo !== null) {
            resolve(pageNo);
          }
        });

        if (pageRenderRef.current) {
          pageRenderRef.current.appendChild(li);
        }

      });
    });
  };

  const convertBlobToBase64 = (data: BlobPart) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      data = new Blob([data], {type: "application/pdf"});
      fileReader.onload = (evt) => {
        const result = fileReader.result;
        try {
          //fileReader = null; // clear file reader
          resolve(result);
        } catch (e) {
          //fileReader = null; // clear file reader
          reject(e);
        }
      };
      fileReader.readAsDataURL(data);
    });
  };

  return (
    <div>
      <div ref={pageRenderRef}></div>
    </div>
  );
};

export default Roadmap;
