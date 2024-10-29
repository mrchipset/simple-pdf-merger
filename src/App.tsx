import { useState, useEffect } from 'react'

import './App.css'

import PdfFileCard from '@/components/PdfFileCard'
import { v4 as uuidv4 } from 'uuid';
import { Button } from './components/ui/button';


import PDFMerger from 'pdf-merger-js/browser';
import { Card } from './components/ui/card';


type Card = {
  uuid: string;
  file: File | null;
}

function App() {
  const [ cards, setCards ] = useState<Card[]>([]);

  function onFileSelect(uuid: string, file : File) {
    setCards((prevState) => ([...prevState, {
      'uuid': uuid,
      'file': file
    }]))
  }

  // function onAddCard() {
  //   const uuid = uuidv4();
  //   setCards((prevState) => ([...prevState, {
  //     'uuid': uuid,
  //     'file': null
  //   }]))
  // }

  function onRemoveCard(uuid : string) {
    setTimeout(() => setCards((prevState) => {
      const newCards = [...prevState ];

      // delete new file and add later.
      const index = newCards.findIndex((card) => card.uuid === uuid);
      if (index !== -1) {
        newCards.splice(index, 1);
      }
      

      // const _uuid = uuidv4();
      // const _newCards = [...newCards, {
      //   'uuid': _uuid,
      //   'file': null
      // }];
      return newCards;
    }), 0);
  }

  useEffect(() => {
    // onAddCard();
    setCards([]);
    return () => { setCards([]); };
  }, []);



  async function mergePdfFiles(pdfFiles: File[]) {
    const render = async() => {

      const merger = new PDFMerger();
      for(const file of pdfFiles) {
        await merger.add(file);
      }

      // const mergedPdf = await merger.saveAsBlob();
      // const url = URL.createObjectURL(mergedPdf);
      // window.open(url);
      await merger.save('merged');
    }

    render().catch(err => console.log('error', err));
  }

  function mergePdf() {
    const files:File[]= [];
    cards.forEach((card: any, _: number) => {
      if (card.file!== null) {
        files.push(card.file);
      }
    });

    mergePdfFiles(files);
  }

  const generatedCards =  () => {
    const _cards = [...cards, {
      'uuid': uuidv4(),
      'file': null
    }];

    return _cards.map((card : any) => {
      return <PdfFileCard key={card.uuid} uuid={card.uuid}
        className='card'
        fileSelect={onFileSelect}
        removeCard={onRemoveCard}
        />
    });
  };
    


  return (
    <>
    <div className='flex flex-col px-8 h-screen'>
      <h2 className='font-bold text-4xl mb-4'>PDF Merge</h2>
      <div className="grid grid-cols-4  gap-4">
        {
          generatedCards()
        }
      </div>

    </div>
    <footer className="w-full fixed bottom-0 h-20 justify-left mx-2 flex space-x-4">
      <Button className="w-20 h-16" onClick={() => {
        setTimeout(()  => {
          setCards([]);
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
