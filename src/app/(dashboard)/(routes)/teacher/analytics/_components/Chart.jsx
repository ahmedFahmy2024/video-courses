"use client";

import { Card } from "@/components/ui/card";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, } from 'recharts';

const Chart = ({ data }) => {
  return (
    <Card>
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`}/>
                    <Bar dataKey="total" fill="#0369a1" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </Card>
  )
}

export default Chart