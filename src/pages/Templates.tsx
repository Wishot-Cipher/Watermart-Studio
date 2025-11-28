import React from 'react'
import Card from '@/components/Card'

export default function Templates() {
  return (
    <div className="max-w-5xl mx-auto">
      <h3 className="text-h3 mb-4">Templates</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <Card key={i} variant="standard">
            <div className="h-40 flex items-center justify-center">Template {i}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
