import React from 'react'
import type { BlockInstance } from '../blocks/blocks'
import { BLOCKS } from '../blocks/blocks'
import type { Theme } from '../App'

export function Canvas({ theme, blocks, selectedId, onSelect, onRemove, onUpdate, onMoveUp, onMoveDown, onDuplicate, onReorder }:{
  theme: Theme
  blocks: BlockInstance[]
  selectedId: string | null
  onSelect: (id: string|null)=>void
  onRemove: (id: string)=>void
  onUpdate: (id: string, props:any)=>void
  onMoveUp: (id: string)=>void
  onMoveDown: (id: string)=>void
  onDuplicate: (id: string)=>void
  onReorder: (fromIndex:number, toIndex:number)=>void
}){
  function renderBlock(b: BlockInstance, index: number){
    const def = BLOCKS.find(d=> d.type===b.type)!
    return (
      <div
        key={b.id}
        className={"block" + (selectedId===b.id? ' selected':'')}
        onClick={(e)=>{ e.stopPropagation(); onSelect(b.id) }}
        draggable
        onDragStart={(e)=>{ e.dataTransfer.setData('text/plain', String(index)); e.dataTransfer.effectAllowed='move' }}
        onDragOver={(e)=>{ e.preventDefault(); e.dataTransfer.dropEffect='move' }}
        onDrop={(e)=>{ e.preventDefault(); const from = Number(e.dataTransfer.getData('text/plain')); if(!Number.isNaN(from)) onReorder(from, index) }}
      >
        <div className="block-toolbar">
          <div className="block-label">{def.label}</div>
          <div className="spacer" />
          <button className="ghost" onClick={(e)=>{ e.stopPropagation(); onMoveUp(b.id) }}>Up</button>
          <button className="ghost" onClick={(e)=>{ e.stopPropagation(); onMoveDown(b.id) }}>Down</button>
          <button className="ghost" onClick={(e)=>{ e.stopPropagation(); onDuplicate(b.id) }}>Duplicate</button>
          <button className="ghost" onClick={(e)=>{ e.stopPropagation(); onRemove(b.id) }}>Remove</button>
        </div>
        <div className="block-content">
          {def.render(b.props, theme)}
        </div>
      </div>
    )
  }

  return (
    <div className="canvas" onClick={()=> onSelect(null)}>
      {blocks.length===0 && (
        <div className="empty">Add blocks from the left panel to get started.</div>
      )}
      {blocks.map((b, i)=> renderBlock(b, i))}
    </div>
  )
}
