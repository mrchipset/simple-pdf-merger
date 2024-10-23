import { useState, useRef , ChangeEvent} from 'react'

import './PdfFileCard.css'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// import * as PDFJS from  'pdfjs-dist/build/pdf.mjs'
// import * as PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs';
import * as PDFJS from 'pdfjs-dist'
// PDFJS.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${PDFJS.version}/legacy/build/pdf.worker.min.js`
// PDFJS.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.min.js';
PDFJS.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

type PdfFileCardProps = React.ComponentProps<typeof Card>

function PdfFileCard({ className, ...props }: PdfFileCardProps) {
    const [ isLoaded, setIsLoaded ] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    
    function onButtonClick() {
        fileInputRef.current?.click();
    }

    function onFileChange(e : ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        const file = e.target.files[0];
        
        setIsLoaded(true);
        console.log(file);
        // add new file to the list
        // render the first page
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!e.target?.result) {
                return;
            }
            const data = new Uint8Array(e.target.result as ArrayBuffer);
            renderCanvas(data)
        //   extractTextFromPDF(data);
        };
     
        reader.readAsArrayBuffer(file);


    }


    
    function renderCanvas(data : Uint8Array) {
        const canvas = canvasRef.current;
        PDFJS.getDocument(data).promise.then((pdf :any) => {
            if (pdf.numPages > 0) {
                pdf.getPage(1).then((page  :any) => {
                    const ctx = canvas?.getContext('2d');
                    const dpr = window.devicePixelRatio || 1;
                    const bsr = 1;
                    const ratio = dpr / bsr;
                    const viewport = page.getViewport({
                        rotation: 0,
                        scale: 1
                    });
                    if (canvas) {
                        canvas.width = viewport.width * ratio;
                        canvas.height =viewport.height * ratio;
                    }

                    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);


                    const renderContext = {
                        canvasContext: ctx,
                        viewport: viewport
                    }

                    page.render(renderContext);
                });
            }
            
        });
    }
    return (
        <>
            <Card className={cn("w-[380px]", className)} {...props}>
                <CardContent className="flex h-full w-full justify-center items-center">
                    <div className='size-full'>
                        <Button variant="ghost" className={isLoaded ? "hidden" : "size-full"} onClick={onButtonClick}>
                            <span className="text-[10em] text-[#242529]">
                                +
                            </span>
                        </Button>

                        <div className={!isLoaded ? "hidden" : "size-full"}>
                            <canvas className='size-full' ref={canvasRef}/>
                        </div>

                        <input type="file" ref={fileInputRef} accept="application/pdf" className='hidden' onChange={onFileChange}/>  

                    </div>
                </CardContent>
            </Card>
        </>
    )
}


export default PdfFileCard
