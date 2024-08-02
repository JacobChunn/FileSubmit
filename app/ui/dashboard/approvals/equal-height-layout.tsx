import React from 'react';

export default function EqualHeightLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <div className="flex flex-col w-full h-full">
            {React.Children.map(children, (child) => (
                <div className="flex-1">
                    {child}
                </div>
            ))}
        </div>
    );
}