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

  function onClearCards() {
    const uuid = uuidv4();
    setCardFileMaps((prevState) => ({[uuid]: {
      'uuid': uuid,
      'file': null
    }}));
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
  
  function mergePdf() {

  }

  return (
    <>
    <div className='flex flex-col px-8 h-screen'>
      <h2 className='font-bold text-4xl'>PDF Merge</h2>
      <div className="grid grid-cols-5 pt-8 gap-1">
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

      <Button className="w-20 h-16" onClick={mergePdf}>Merge</Button>
    </footer>
    </>
  )
}

export default App
