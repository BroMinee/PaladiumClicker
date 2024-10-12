'use client';
import React, { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import '@/styles/MyTreeView.css';
import { FaCheckSquare, FaChevronDown, FaChevronRight, FaSquare } from 'react-icons/fa';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card.tsx";

const MyTreeView: React.FC = () => {
  const [checked, setChecked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    console.log(checked);
  }, [checked]);

  useEffect(() => {
    console.log(expanded);
  }, [expanded]);

  const nodes = [
    {
      value: 'node1',
      label:
        <div className="inline-flex gap-2 justify-center items-center">
          <Image src="/AH_img/paladium_ingot.png" alt="Node 1" width={32} height={32} className="pixelated"/>
          <div>Node 1</div>
        </div>,
      children: [
        {
          value: 'child1',
          label: <div className="inline-flex gap-2 justify-center items-center">
            <Image src="/AH_img/titane_ingot.png" alt="Children 1" width={32} height={32} className="pixelated"/>
            <div>Child 1</div>
          </div>,
        },
        {
          value: 'child2',
          label: <div className="inline-flex gap-2 justify-center items-center">
            <Image src="/AH_img/amethyst_ingot.png" alt="Children 2" width={32} height={32} className="pixelated"/>
            <div>Child 2</div>
          </div>,
        },
      ],
    },
    {
      value: 'node2',
      label: <div className="inline-flex gap-2 justify-center items-center">
        <Image src="/AH_img/paladium_ingot.png" alt="Children 2" width={32} height={32} className="pixelated"/>
        <div>Node 2</div>
      </div>,
    },
  ];

  return (
    <Card className="flex-grow">
      <CardContent className="pt-2">
        <CheckboxTree
          nodes={nodes}
          checked={checked}
          expanded={expanded}
          onCheck={(checked) => setChecked(checked)}
          onExpand={(expanded) => setExpanded(expanded)}
          icons={{
            check: <FaCheckSquare/>,
            uncheck: <FaSquare/>,
            halfCheck: <FaSquare/>,
            expandClose: <FaChevronRight/>,
            expandOpen: <FaChevronDown/>,
            parentClose: null,
            parentOpen: null,
            leaf: null,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default MyTreeView;
