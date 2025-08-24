import React from 'react'
import type { BlockDefinition } from '../blocks/blocks'

type Preset = { id:string; type: BlockDefinition['type']; name: string; props: any }

export function Palette({ blocks, onAdd, savedPresets = [], onAddPreset }: { blocks: BlockDefinition[]; onAdd: (b: BlockDefinition)=>void; savedPresets?: Preset[]; onAddPreset?: (p: Preset)=>void }){
  return (
    <div className="palette">
      <div className="palette-title">Blocks</div>
      <div className="palette-list">
        {blocks.map(b=> (
          <button key={b.type} className="palette-item" onClick={()=>onAdd(b)}>{b.label}</button>
        ))}
      </div>
      {savedPresets.length>0 && (
        <>
          <div className="palette-title" style={{ marginTop:12 }}>Saved Blocks</div>
          <div className="palette-list">
            {savedPresets.map(p=> (
              <button key={p.id} className="palette-item" title={p.name} onClick={()=> onAddPreset && onAddPreset(p)}>
                {p.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
