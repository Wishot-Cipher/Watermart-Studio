import React from 'react'
import Card from '@/components/Card'

export default function Settings() {
  return (
    <div className="max-w-5xl mx-auto">
      <h3 className="text-h3 mb-4">Settings</h3>
      <Card variant="glass">
        <div className="flex flex-col gap-4">
          <div>General Settings</div>
          <div>Export Settings</div>
          <div>Appearance</div>
        </div>
      </Card>
    </div>
  )
}
