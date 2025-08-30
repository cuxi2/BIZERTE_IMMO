'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onStartDateChange?: (date: Date | undefined) => void
  onEndDateChange?: (date: Date | undefined) => void
  unavailableDates?: Date[]
  className?: string
  disabled?: boolean
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  unavailableDates = [],
  className = '',
  disabled = false
}: DateRangePickerProps) {
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailable => 
      date.toDateString() === unavailable.toDateString()
    )
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      {/* Start Date Picker */}
      <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-[180px] justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "dd MMM yyyy", { locale: fr }) : "Date d'arrivée"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date) => {
              onStartDateChange?.(date)
              setIsStartOpen(false)
            }}
            disabled={(date) => 
              date < new Date() || isDateUnavailable(date) || (endDate && date > endDate)
            }
            initialFocus
            locale={fr}
          />
        </PopoverContent>
      </Popover>

      {/* End Date Picker */}
      <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-[180px] justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
            disabled={disabled || !startDate}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "dd MMM yyyy", { locale: fr }) : "Date de départ"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date) => {
              onEndDateChange?.(date)
              setIsEndOpen(false)
            }}
            disabled={(date) => 
              !startDate || 
              date < startDate || 
              isDateUnavailable(date)
            }
            initialFocus
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}