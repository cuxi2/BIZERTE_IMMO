'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ListingMedia } from '@/types/db'

interface GalleryProps {
  media: ListingMedia[]
  className?: string
}

export default function Gallery({ media, className = '' }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (!media || media.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center h-64 ${className}`}>
        <p className="text-gray-500">Aucune image disponible</p>
      </div>
    )
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
  }

  const currentMedia = media[selectedIndex]

  return (
    <div className={className}>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Main Image */}
        <div className="md:col-span-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="cursor-pointer relative group">
                {currentMedia.type === 'image' ? (
                  <img
                    src={currentMedia.url}
                    alt="Image principale"
                    className="w-full h-64 md:h-80 object-cover rounded-xl"
                  />
                ) : (
                  <video
                    src={currentMedia.url}
                    className="w-full h-64 md:h-80 object-cover rounded-xl"
                    controls={false}
                    muted
                  />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <p className="text-white font-medium">Cliquer pour agrandir</p>
                </div>
              </div>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                {currentMedia.type === 'image' ? (
                  <img
                    src={currentMedia.url}
                    alt="Image en grand"
                    className="w-full h-auto max-h-[85vh] object-contain"
                  />
                ) : (
                  <video
                    src={currentMedia.url}
                    className="w-full h-auto max-h-[85vh] object-contain"
                    controls
                    autoPlay
                  />
                )}
                
                {media.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Thumbnails */}
        {media.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            {media.slice(1, 5).map((item, index) => (
              <div
                key={item.id}
                className="cursor-pointer relative group"
                onClick={() => setSelectedIndex(index + 1)}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={`Image ${index + 2}`}
                    className={`w-full h-20 md:h-24 object-cover rounded-lg ${
                      selectedIndex === index + 1 ? 'ring-2 ring-primary' : ''
                    }`}
                  />
                ) : (
                  <video
                    src={item.url}
                    className={`w-full h-20 md:h-24 object-cover rounded-lg ${
                      selectedIndex === index + 1 ? 'ring-2 ring-primary' : ''
                    }`}
                    muted
                  />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                {item.type === 'video' && (
                  <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                    📹
                  </div>
                )}
              </div>
            ))}
            
            {media.length > 5 && (
              <div
                className="bg-gray-100 rounded-lg h-20 md:h-24 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => setIsDialogOpen(true)}
              >
                <p className="text-sm font-medium text-gray-600">
                  +{media.length - 4} photos
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation for single column */}
      {media.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground">
            {selectedIndex + 1} / {media.length}
          </span>
          
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}