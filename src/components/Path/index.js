import React, { useState} from 'react';
import Tree from 'react-d3-tree';
import { v4 as uuidv4 } from 'uuid';
import { useCenteredTree } from "./helpers";
import Node from './Node';

const transformTree = (node) => {
    if(!node) return [];
    const arr = [];
    const data = {
        name: node.name,
        icon: node.icon,
        children: []
    };

    for(let i = 0; i < node.children.length; i++) {
        data['children'].push(transformTree(node.children[i]));
    }

    return data;
}

const nodeMap = new Map();

const Path = ({
    id,
    backgroundColor,
    elementsSize
}) => {
    const [ data, setData ] = useState(null);
    const [dimensions, translate, containerRef] = useCenteredTree();

    const renderRectSvgNode = ({ nodeDatum, toggleNode }) => {
        const { icon } = JSON.parse(nodeDatum.icon)
        
        return (
            <g>
                <image
                    onDrop={((nodeDatum) => e => {
                        const item = e.dataTransfer.getData("item");
                        const c = nodeDatum;

                        const node = new Node(item, item)
                        debugger
                        nodeMap.set(item, node)
                    })(nodeDatum)} xlinkHref={icon} width="32px" height="32px"/>
            </g>
        );
    };

    const root = new Node(1, 'icon 1');
    const node2 = new Node(2, 'icon 2');
    const node3 = new Node(3, 'icon 3');
    const node4 = new Node(4, 'icon 4');
    const node5 = new Node(5, 'icon 5');

    node2.addChild(node3);
    node2.addChild(node4);
    node4.addChild(node5);

    root.addChild(node2)

console.log('root', transformTree(data))
    return (
        <div
            ref={containerRef}
            className='path-zone'
            style={{backgroundColor, width: elementsSize[0], height: elementsSize[1]}}
            onDragStart={(e) => {}}
            onDragEnter={e => e.preventDefault()}
            onDragOver={e => e.preventDefault()}
            onDrop={(e) => {
                const c = e;
                const item = c.dataTransfer.getData("item");
                const uuid = uuidv4();
                const node = new Node(uuid, item);
                
                nodeMap.set(uuid, node);
                
                setData(node);
            }}
            draggable
        >
            { data && (
                <Tree
                    data={transformTree(data)}
                    dimensions={dimensions}
                    translate={translate}
                    renderCustomNodeElement={renderRectSvgNode}
                    orientation="vertical"
                />
            )}
        </div>
    );
};

export default Path;