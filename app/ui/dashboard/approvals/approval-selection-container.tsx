import React from 'react';

export default function ApprovalSelectionContainer({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <div className="flex w-full">
            {React.Children.map(children, (child) => (
                <div className="flex-1">
                    {child}
                </div>
            ))}
        </div>
    );
}
