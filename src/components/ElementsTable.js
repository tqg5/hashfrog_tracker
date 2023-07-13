import { Fragment, useMemo } from "react";

import LayoutID from "../utils/layout-id";
import { splitIntoChunk } from "../utils/utils";
import Element from "./Element";

const ElementsTable = props => {
  const {
    columns = 1,
    elements = [], // array of elements from elements.json it will fill the table by rows
    elementsSize = null, // [0, 0] optional
    padding = 1, // for td
    swappable = false // allowing this component to be eligible for swapping icons on drag
  } = props;

  const rows = useMemo(() => {
    console.log('elements', elements)
    console.log('swappable', swappable)
    const itemComponents = elements.map((element, index) => (
      <td key={`${index}-${element.id}`} style={{ padding }}>
        <Element {...element} id={LayoutID.getID()} size={elementsSize || element.size} swappable={swappable} />
      </td>
    ));

    const splitArray = splitIntoChunk(itemComponents, columns);

    return splitArray.map((rows, index) => <tr key={index}>{rows}</tr>);
  }, [columns, elements, padding, elementsSize, swappable]);

  return (
    <Fragment>
      <table style={{ borderSpacing: 0 }}>
        <tbody>{rows}</tbody>
      </table>
    </Fragment>
  );
};

export default ElementsTable;
