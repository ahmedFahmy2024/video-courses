import { IconBadge } from '@/components/dashboard/iconBadge/IconBadge'
import React from 'react'

const InfoCard = ({icon: Icon, label, numberOfItems, variant}) => {
  return (
    <div className='border rounded-md flex items-center gap-x-2 p-3'>
        <IconBadge variant={variant} icon={Icon} />
        <div>
            <p className='font-medium'>
                {label}
            </p>
            <p className='text-sm text-gray-500'>{numberOfItems} {numberOfItems === 1 ? "course" : "courses"}</p>
        </div>
    </div>
  )
}

export default InfoCard