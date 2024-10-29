import { useState, useEffect } from 'react'

import './App.css'

import PdfFileCard from '@/components/PdfFileCard'
import { v4 as uuidv4 } from 'uuid';
import { Button } from './components/ui/button';


import PDFMerger from 'pdf-merger-js/browser';
import { Card } from './components/ui/card';


import type { DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { DndContext, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';


type Card = {
  uuid: string;
  file: File | null;
}

function App() {
  const [ cards, setCards ] = useState<Card[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  function onFileSelect(uuid: string, file : File) {
    setCards((prevState) => ([...prevState, {
      'uuid': uuid,
      'file': file
    }]))
  }


  function onRemoveCard(uuid : string) {
    setTimeout(() => setCards((prevState) => {
      const newCards = [...prevState ];

      // delete new file and add later.
      const index = newCards.findIndex((card) => card.uuid === uuid);
      if (index !== -1) {
        newCards.splice(index, 1);
      }
    
      return newCards;
    }), 0);
  }

  useEffect(() => {
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
    

  const getMovedIndex = (array: Card[], dragItem: DragMoveEvent) => {
    const { active, over } = dragItem;
    const activeIndex = array.findIndex((item: Card) => item.uuid === active.id);
    const overIndex = array.findIndex((item: Card)  => item.uuid === over?.id);

    return {
      activeIndex: activeIndex !== -1 ? activeIndex : 0,
      overIndex: overIndex!== -1 ? overIndex : activeIndex
    }
  }

  const dragEndEvent = (dragItem: DragEndEvent) => {
    const { active, over }  = dragItem;
    if (!active ||!over) {
      return;
    }

    const _cards  = [...cards];
    const { activeIndex, overIndex }  = getMovedIndex(_cards, dragItem);
    if (activeIndex !== overIndex) {
      const _finalCards = arrayMove(_cards, activeIndex, overIndex);
      setCards(_finalCards);
    }

  }

  return (
    <>
    <div className='flex flex-col px-8 h-screen'>
      <h2 className='font-bold text-4xl mb-4'>PDF Merge</h2>
      <DndContext sensors={sensors} onDragEnd={dragEndEvent}>
        <SortableContext
          items={cards.map((card: Card) => card.uuid)}
          strategy={rectSortingStrategy}
        >
        <div className="grid grid-cols-4  gap-4">
        {
          generatedCards()
        }
        </div>
        </SortableContext>
      </DndContext>


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
