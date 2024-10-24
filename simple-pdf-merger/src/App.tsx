import { useState, useEffect } from 'react'

import './App.css'

import PdfFileCard from '@/components/PdfFileCard'
import { v4 as uuidv4 } from 'uuid';
import { Button } from './components/ui/button';
// import { BellIcon, CheckIcon } from "@radix-ui/react-icons"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Switch } from "@/components/ui/switch"


import PDFMerger from 'pdf-merger-js/browser';




function App() {
  const [ cardFileMaps, setCardFileMaps ] = useState({});

  function onFileSelect(uuid: string, file : File) {
    setCardFileMaps((prevState) => ({...prevState, [uuid]: {
      'uuid': uuid,
      'file': file
    }
    }))
  }

  function onAddCard() {
    const uuid = uuidv4();
    setCardFileMaps((prevState) => ({...prevState, [uuid]: {
      'uuid': uuid,
      'file': null
    }
    }))
  }

  useEffect(() => {
    onAddCard();
    return () => { setCardFileMaps({}); };
  }, []);

  const generatedCards = 
    Object.values(cardFileMaps).map((card : any) => {
      return <PdfFileCard uuid={card.uuid}
        className='card'
        onFileSelect={onFileSelect}
        onAddCard={onAddCard} />
  });
  

  async function mergePdfFiles(pdfFiles: File[]) {
    const render = async() => {
      const merger = new PDFMerger();
      // pdfFiles.forEach(async file => {
      //   await merger.add(file);
      // });
  
      for(const file of pdfFiles) {
        await merger.add(file);
      }
      // const mergedPdf = await merger.saveAsBlob();
      // const url = URL.createObjectURL(mergedPdf);
      // window.open(url);
      await merger.save('merged.pdf');
    }

    render().catch(err => console.log('error', err));
  }

  function mergePdf() {
    const files:File[]= [];
    Object.values(cardFileMaps).map((card : any) => {
      if (card.file!== null) {
        files.push(card.file);
      }
    });
    mergePdfFiles(files);
  }

  return (
    <>
    <div className='flex flex-col px-8 h-screen'>
      <h2 className='font-bold text-4xl mb-4'>PDF Merge</h2>
      <div className="grid grid-cols-4  gap-4">
        {
          generatedCards
        }
      </div>

    </div>
    <footer className="w-full fixed bottom-0 h-20 justify-left mx-2 flex space-x-4">
      <Button className="w-20 h-16" onClick={() => {
        setTimeout(()  => {
          setCardFileMaps({});
          setTimeout(()=> {
            onAddCard();
          }, 0);
        }, 0)
      }}>
        Clear
      </Button>

      <Button className="w-20 h-16" onClick={async () => { await mergePdf();}}>Merge</Button>
    </footer>
    </>
  )
}

export default App
