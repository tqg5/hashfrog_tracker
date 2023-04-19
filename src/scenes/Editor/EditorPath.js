import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import labelsJSON from "../../data/labels.json";
import { generateId } from "../../utils/utils";

const toNumber = [
  "coordX",
  "coordY",
  "size_width",
  "size_height",
  "width",
  "columns",
  "counterMin",
  "counterMax",
  "selectedStartingIndex",
  "labelStartingIndex",
  "hintNumber",
];

const EditorPath = ({ path, setPath, combinedElements }) => {
  let { position, type, displayName = "" } = path;
  let [coordX, coordY] = position;

  const handleTypeChange = useCallback(
    event => {
      const { value } = event.target;

      switch (value) {
        case "element":
          setPath({
            id: path.id,
            type: "element",
            elementId: "a081121b16f84366bf16e16ca90cd23f",
            position: path.position,
            size: [25, 25],
            receiver: false,
            dragCurrent: false,
            selectedStartingIndex: 0,
            countConfig: [0, 5],
            labelStartingIndex: 0,
          });
          break;
        case "table":
          setPath({
            id: path.id,
            type: "table",
            position: path.position,
            columns: 3,
            padding: "2px",
            elements: [],
            elementsSize: [25, 25],
          });
          break;
        case "locationhint":
          setPath({
            id: path.id,
            type: "locationhint",
            elementId: "4c1b24c3e3954038b14f4daa3656e0b5",
            position: path.position,
            labels: "locations",
            width: 250,
            color: "#ffffff",
            backgroundColor: "#4a8ab6",
            showBoss: true,
            showItems: true,
          });
          break;

        case "hinttable":
          setPath({
            id: path.id,
            type: "hinttable",
            elementId: "4c1b24c3e3954038b14f4daa3656e0b5",
            position: path.position,
            hintType: "sometimes",
            hintNumber: 1,
            columns: 1,
            width: 200,
            padding: "2px",
            labels: "sometimes",
            color: "#ffffff",
            backgroundColor: "#333333",
            showIcon: true,
            inverted: false,
            showBoss: true,
            showItems: true,
          });
          break;
        case "label":
          setPath({
            id: path.id,
            type: "label",
            position: path.position,
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: "2px",
            text: "Label Text",
            fontSize: "12px",
          });
          break;
        case "path":
          setPath({
            id: path.id,
            type: "path",
            position: path.position,
            backgroundColor: "#000000",
            elementsSize: [25, 25],
          });
        default:
          break;
      }
    },
    [path, setPath],
  );

  const handleChange = useCallback(
    event => {
      let { value } = event.target;
      const { name } = event.target;

      if (toNumber.includes(name)) value = parseInt(value, 10);

      switch (name) {
        // Coords specific
        case "coordX":
        case "coordY": {
          setPath(prev => ({
            ...prev,
            position: name === "coordX" ? [value, prev.position[1]] : [prev.position[0], value],
          }));
          break;
        }
        // Size specific
        case "size_width":
        case "size_height": {
          setPath(prev => {
            let property = "";

            if (prev.type === "element") property = "size";
            if (prev.type === "table" || prev.type === 'path') property = "elementsSize";

            let propertyValue = prev[property];
            return {
              ...prev,
              [property]: name === "size_width" ? [value, propertyValue[1]] : [propertyValue[0], value],
            };
          });
          break;
        }
        // Counter
        case "counterMin":
        case "counterMax": {
          setPath(prev => ({
            ...prev,
            countConfig: name === "counterMin" ? [value, prev.countConfig[1]] : [prev.countConfig[0], value],
          }));
          break;
        }
        // Checkbox
        case "showBoss":
        case "showItems":
        case "showPath":
        case "showIcon":
        case "inverted":
        case "dragCurrent":
        case "receiver": {
          setPath(prev => ({
            ...prev,
            [name]: !prev[name],
          }));
          break;
        }
        // General
        default: {
          setPath(prev => ({
            ...prev,
            [name]: value,
          }));
          break;
        }
      }
    },
    [setPath],
  );

  // Check if element inexistent because is a custom and got deleted. Revert to an existing one.
  useEffect(() => {
    const index = combinedElements.findIndex(x => x.id === path.elementId);
    if (index === -1) {
      setPath(prev => ({
        ...prev,
        elementId: "a081121b16f84366bf16e16ca90cd23f",
      }));
    }
  }, [combinedElements, path.elementId, setPath]);

  return (
    <Fragment>
      <p className="uuid">Path Id: {path.id}</p>
      <div className="mb-2">
        <label htmlFor="name" className="form-label">
          Path Name
        </label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          className="form-control form-control-sm"
          placeholder="Path Name"
          value={displayName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="" className="form-label">
          Path Type
        </label>
        <select className="form-select form-select-sm" id="type" name="type" value={type} onChange={handleTypeChange}>
          <option value="" disabled>
            Select type
          </option>
          <option value="element">Individual Element</option>
          <option value="table">Table of Elements</option>
          <option value="sometimeshint">Sometimes Hint</option>
          <option value="locationhint">Location Hint</option>
          <option value="hinttable">Table of Hints</option>
          <option value="label">Label</option>
          <option value="path">Path Element</option>
        </select>
      </div>
      <div className="col mb-2">
        <label htmlFor="width" className="form-label">
          Path Position
        </label>
        <div className="input-group input-group-sm ">
          <input
            type="number"
            id="coordX"
            name="coordX"
            className="form-control"
            placeholder="X Coordinate"
            value={coordX}
            onChange={handleChange}
          />
          <span className="input-group-text">X</span>
          <input
            type="number"
            id="coordY"
            name="coordY"
            className="form-control"
            placeholder="Y Coordinate"
            value={coordY}
            onChange={handleChange}
          />
        </div>
      </div>
      {type === "element" && (
        <ElementEditor path={path} handleChange={handleChange} combinedElements={combinedElements} />
      )}
      {type === "table" && (
        <TableEditor path={path} handleChange={handleChange} combinedElements={combinedElements} />
      )}
      {type === "locationhint" && (
        <LocationhintEditor path={path} handleChange={handleChange} combinedElements={combinedElements} />
      )}
      {type === "hinttable" && (
        <HintTableEditor path={path} handleChange={handleChange} combinedElements={combinedElements} />
      )}
      {type === "label" && <LabelEditor path={path} handleChange={handleChange} />}
      {type === "path" && <PathEditor path={path} handleChange={handleChange} />}
    </Fragment>
  );
};

const PathEditor = ({ path, handleChange, combinedElements }) => {
  return (
    <Fragment>
      <div className="col mb-2">
        <label htmlFor="width" className="form-label">
          Elements Size
        </label>
        <div className="input-group input-group-sm">
          <input
            type="number"
            id="size_width"
            name="size_width"
            className="form-control"
            placeholder="Element Width"
            value={path.elementsSize[0]}
            onChange={handleChange}
          />
          <span className="input-group-text">X</span>
          <input
            type="number"
            id="size_height"
            name="size_height"
            className="form-control"
            placeholder="Element Height"
            value={path.elementsSize[1]}
            onChange={handleChange}
          />
        </div>
        <div className="row">
          <div className="col-12">
            <label htmlFor="color" className="form-label">
              Background Color
            </label>
          </div>
          <div className="col-6 mb-2">
            <input
              type="color"
              className="form-control form-control-sm"
              id="backgroundColor"
              name="backgroundColor"
              title="Choose background color"
              value={path.backgroundColor}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col">
          <p className="uuid">Wheel Click changes the hue of background color.</p>
        </div>
      </div>
    </Fragment>
  );
};

const ElementEditor = ({ path, handleChange, combinedElements }) => {
  const element = useMemo(() => {
    return combinedElements.find(x => x.id === path.elementId);
  }, [combinedElements, path.elementId]);

  if (!element) return null;

  return (
    <Fragment>
      <div className="mb-2">
        <label htmlFor="" className="form-label">
          Element (Item / Equipment / Others)
        </label>
        <select
          className="form-select form-select-sm"
          id="elementId"
          name="elementId"
          value={path.elementId}
          onChange={handleChange}
        >
          {combinedElements.map(element => (
            <option key={element.id} value={element.id}>
              {element.displayName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="width" className="form-label">
          Element Size
        </label>
        <div className="input-group input-group-sm ">
          <input
            type="number"
            id="size_width"
            name="size_width"
            className="form-control"
            placeholder="Element Width"
            value={path.size[0]}
            onChange={handleChange}
          />
          <span className="input-group-text">X</span>
          <input
            type="number"
            id="size_height"
            name="size_height"
            className="form-control"
            placeholder="Element Height"
            value={path.size[1]}
            onChange={handleChange}
          />
        </div>
      </div>
      {element.type === "counter" && (
        <div className="mb-2">
          <label htmlFor="counterMin" className="form-label">
            Counter Min/Max
          </label>
          <div className="input-group input-group-sm ">
            <input
              type="number"
              id="counterMin"
              name="counterMin"
              className="form-control"
              placeholder="Counter Min"
              value={path.countConfig[0]}
              onChange={handleChange}
            />
            <span className="input-group-text">To</span>
            <input
              type="number"
              id="counterMax"
              name="counterMax"
              className="form-control"
              placeholder="Counter Max"
              value={path.countConfig[1]}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      {element.type !== "counter" && (
        <div className="row">
          <div className="col-6 mb-2">
            <label htmlFor="width" className="form-label">
              Starting Index
            </label>
            <input
              type="number"
              id="selectedStartingIndex"
              name="selectedStartingIndex"
              className="form-control form-control-sm"
              placeholder="Selected Starting Index"
              value={path.selectedStartingIndex}
              onChange={handleChange}
              min={0}
              max={element.icons.length - 1}
            />
          </div>
          <div className="col-6 mb-2">
            <label htmlFor="width" className="form-label">
              Label Starting Index
            </label>
            <input
              type="number"
              id="labelStartingIndex"
              name="labelStartingIndex"
              className="form-control form-control-sm"
              placeholder="Label Starting Index"
              value={path.labelStartingIndex}
              onChange={handleChange}
              min={0}
              max={element?.label?.length - 1 || 0}
              disabled={element?.type !== "label" || !Array.isArray(element?.label)}
            />
          </div>
        </div>
      )}
      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="receiver"
          name="receiver"
          checked={path.receiver}
          value={path.receiver}
          onChange={handleChange}
        />
        <label htmlFor="receiver" className="form-check-label">
          Receiver (able to drag into it)
        </label>
      </div>
      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="dragCurrent"
          name="dragCurrent"
          checked={path.dragCurrent}
          value={path.dragCurrent}
          onChange={handleChange}
        />
        <label htmlFor="dragCurrent" className="form-check-label">
          Drag currently selected
        </label>
      </div>
    </Fragment>
  );
};

const TableEditor = ({ path, handleChange, combinedElements }) => {
  const [elements, setElements] = useState([...path.elements.map(x => ({ id: generateId(), value: x }))]);
  const [element, setElement] = useState("default_hashfrog");
  const [draggedElement, setDraggedElement] = useState(null);

  const handleElementChange = event => {
    const { value } = event.target;
    setElement(value);
  };

  useEffect(() => {
    handleChange({
      target: {
        name: "elements",
        value: elements.map(x => x.value),
      },
    });
  }, [elements, handleChange]);

  const addToTable = useCallback(() => {
    const newElement = {
      id: generateId(),
      value: element,
    };
    setElements(prev => [...prev, newElement]);
    // setElement("a081121b16f84366bf16e16ca90cd23f");
  }, [element]);

  const removeFromTable = (e, element) => {
    e.preventDefault();
    setElements(prev => [...prev.filter(x => x.id !== element.id)]);
  };

  const onDragStart = (event, element) => {
    setDraggedElement(element);
    event.dataTransfer.effectAllowed = "move";
    // event.dataTransfer.setDragImage(event.target, 50, 50);
  };

  const onDragEnd = () => {
    setDraggedElement(null);
  };

  const onDragOver = useCallback(
    index => {
      const draggedOverElement = elements[index];
      // Ignore if dragged over itself
      if (draggedOverElement.id === draggedElement.id) return;
      // filter out the currently dragged item
      // add the dragged item after the dragged over item
      setElements(prev => {
        let elements = [...prev.filter(element => element.id !== draggedElement.id)];
        elements.splice(index, 0, draggedElement);
        return elements;
      });
    },
    [draggedElement, elements],
  );

  return (
    <Fragment>
      <div className="col mb-2">
        <label htmlFor="width" className="form-label">
          Elements Size
        </label>
        <div className="input-group input-group-sm">
          <input
            type="number"
            id="size_width"
            name="size_width"
            className="form-control"
            placeholder="Element Width"
            value={path.elementsSize[0]}
            onChange={handleChange}
          />
          <span className="input-group-text">X</span>
          <input
            type="number"
            id="size_height"
            name="size_height"
            className="form-control"
            placeholder="Element Height"
            value={path.elementsSize[1]}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-6">
          <label htmlFor="padding" className="form-label">
            Elements Padding
          </label>
          <input
            type="text"
            id="padding"
            name="padding"
            className="form-control form-control-sm"
            placeholder="Padding for items"
            value={path.padding}
            onChange={handleChange}
          />
        </div>
        <div className="col-6">
          <label htmlFor="columns" className="form-label">
            Table Columns
          </label>
          <input
            type="number"
            id="columns"
            name="columns"
            className="form-control form-control-sm"
            placeholder="Number of Columns"
            value={path.columns}
            onChange={handleChange}
            min={1}
          />
        </div>
        <div className="col-12">
          <p className="uuid">In CSS Padding format</p>
        </div>
      </div>
      <div className="mb-2">
        <label htmlFor="elementId" className="form-label">
          Add Elements to Table
        </label>
        <div className="input-group input-group-sm">
          <select
            className="form-select"
            id="elementId"
            name="elementId"
            value={element}
            onChange={handleElementChange}
          >
            {combinedElements.map(element => (
              <option key={element.id} value={element.name}>
                {element.displayName}
              </option>
            ))}
          </select>
          <button className="btn btn-light btn-sm" type="button" onClick={addToTable}>
            Add
          </button>
        </div>
      </div>
      {elements.length > 0 && (
        <Fragment>
          <p style={{ fontSize: "0.75em", margin: 0, opacity: 0.5 }}>Right click to remove. Drag to re-order.</p>
          <ul className="list-unstyled table-list">
            {elements.map((element, index) => (
              <li
                key={element.id}
                onContextMenu={e => removeFromTable(e, element)}
                onDragStart={e => onDragStart(e, element)}
                onDragEnd={onDragEnd}
                onDragOver={() => onDragOver(index)}
                draggable
              >
                {element.value}
              </li>
            ))}
          </ul>
        </Fragment>
      )}
    </Fragment>
  );
};

const LocationhintEditor = ({ path, handleChange, combinedElements }) => {
  return (
    <Fragment>
      <div className="mb-2">
        <label htmlFor="elementId" className="form-label">
          Element (Item / Equipment / Others)
        </label>
        <select
          className="form-select form-select-sm"
          id="elementId"
          name="elementId"
          value={path.elementId}
          onChange={handleChange}
        >
          {combinedElements.map(element => (
            <option key={element.id} value={element.id}>
              {element.displayName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="labels" className="form-label">
          Label Pool
        </label>
        <select
          className="form-select form-select-sm"
          id="labels"
          name="labels"
          value={path.labels}
          onChange={handleChange}
        >
          {Object.keys(labelsJSON).map(key => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="width" className="form-label">
          Path Width
        </label>
        <input
          type="number"
          id="width"
          name="width"
          className="form-control form-control-sm"
          placeholder="Element Width"
          value={path.width}
          onChange={handleChange}
        />
      </div>
      <div className="row">
        <div className="col-12">
          <label htmlFor="color" className="form-label">
            Text Color & Background Color
          </label>
        </div>
        <div className="col-6 mb-2">
          <input
            type="color"
            className="form-control form-control-sm"
            id="color"
            name="color"
            title="Choose text color"
            value={path.color}
            onChange={handleChange}
          />
        </div>
        <div className="col-6 mb-2">
          <input
            type="color"
            className="form-control form-control-sm"
            id="backgroundColor"
            name="backgroundColor"
            title="Choose background color"
            value={path.backgroundColor}
            onChange={handleChange}
          />
        </div>
        <div className="col">
          <p className="uuid">Wheel Click changes the hue of background color.</p>
        </div>
      </div>
      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="showBoss"
          name="showBoss"
          checked={path.showBoss}
          value={path.showBoss}
          onChange={handleChange}
        />
        <label htmlFor="showBoss" className="form-check-label">
          Show Boss
        </label>
      </div>
      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="showItems"
          name="showItems"
          checked={path.showItems}
          value={path.showItems}
          onChange={handleChange}
        />
        <label htmlFor="showItems" className="form-check-label">
          Show Items
        </label>
      </div>
      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="showPath"
          name="showPath"
          checked={path.showPath}
          value={path.showPath}
          onChange={handleChange}
        />
        <label htmlFor="showPath" className="form-check-label">
          Show Path
        </label>
      </div>
    </Fragment>
  );
};

const HintTableEditor = ({ path, handleChange, combinedElements }) => {
  return (
    <Fragment>
      <div className="mb-2">
        <label htmlFor="labels" className="form-label">
          Hint Type
        </label>
        <select
          className="form-select form-select-sm"
          id="hintType"
          name="hintType"
          value={path.hintType}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select type
          </option>
          <option value="sometimes">Sometimes Hints</option>
          <option value="location">Location Hints</option>
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="labels" className="form-label">
          Label Pool
        </label>
        <select
          className="form-select form-select-sm"
          id="labels"
          name="labels"
          value={path.labels}
          onChange={handleChange}
        >
          {Object.keys(labelsJSON).map(key => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="elementId" className="form-label">
          Element (Item / Equipment / Others)
        </label>
        <select
          className="form-select form-select-sm"
          id="elementId"
          name="elementId"
          value={path.elementId}
          onChange={handleChange}
        >
          {combinedElements.map(element => (
            <option key={element.id} value={element.id}>
              {element.displayName}
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        <div className="col-6 mb-2">
          <label htmlFor="hintNumber" className="form-label">
            Number of Hints
          </label>
          <input
            type="number"
            id="hintNumber"
            name="hintNumber"
            className="form-control form-control-sm"
            placeholder="Hint Number"
            value={path.hintNumber}
            onChange={handleChange}
            min={1}
          />
        </div>
        <div className="col-6 mb-2">
          <label htmlFor="columns" className="form-label">
            Table Columns
          </label>
          <input
            type="number"
            id="columns"
            name="columns"
            className="form-control form-control-sm"
            placeholder="Table Columns"
            value={path.columns}
            onChange={handleChange}
            min={1}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-6 mb-2">
          <label htmlFor="width" className="form-label">
            Element Width
          </label>
          <input
            type="number"
            id="width"
            name="width"
            className="form-control form-control-sm"
            placeholder="Element Width"
            value={path.width}
            onChange={handleChange}
          />
        </div>
        <div className="col-6 mb-2">
          <label htmlFor="padding" className="form-label">
            Hints Padding
          </label>
          <input
            type="text"
            id="padding"
            name="padding"
            className="form-control form-control-sm"
            placeholder="Padding for hints"
            value={path.padding}
            onChange={handleChange}
          />
        </div>
        <div className="col-12">
          <p className="uuid">In CSS Padding format</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <label htmlFor="color" className="form-label">
            Text Color & Background Color
          </label>
        </div>
        <div className="col-6 mb-2">
          <input
            type="color"
            className="form-control form-control-sm"
            id="color"
            name="color"
            title="Choose text color"
            value={path.color}
            onChange={handleChange}
          />
        </div>
        <div className="col-6 mb-2">
          <input
            type="color"
            className="form-control form-control-sm"
            id="backgroundColor"
            name="backgroundColor"
            title="Choose background color"
            value={path.backgroundColor}
            onChange={handleChange}
          />
        </div>
        <div className="col">
          <p className="uuid">Wheel Click changes the hue of background color.</p>
        </div>
      </div>
      {path.hintType === "sometimes" && (
        <Fragment>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showIcon"
              name="showIcon"
              checked={path.showIcon}
              value={path.showIcon}
              onChange={handleChange}
            />
            <label htmlFor="showIcon" className="form-check-label">
              Show Icon
            </label>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="inverted"
              name="inverted"
              checked={path.inverted}
              value={path.inverted}
              onChange={handleChange}
            />
            <label htmlFor="inverted" className="form-check-label">
              Reverse Icon
            </label>
          </div>
        </Fragment>
      )}
      {path.hintType === "location" && (
        <Fragment>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showBoss"
              name="showBoss"
              checked={path.showBoss}
              value={path.showBoss}
              onChange={handleChange}
            />
            <label htmlFor="showBoss" className="form-check-label">
              Show Boss
            </label>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showItems"
              name="showItems"
              checked={path.showItems}
              value={path.showItems}
              onChange={handleChange}
            />
            <label htmlFor="showItems" className="form-check-label">
              Show Items
            </label>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPath"
              name="showPath"
              checked={path.showPath}
              value={path.showPath}
              onChange={handleChange}
            />
            <label htmlFor="showPath" className="form-check-label">
              Show Path
            </label>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const LabelEditor = ({ path, handleChange }) => {
  return (
    <Fragment>
      <div className="mb-2">
        <label htmlFor="text" className="form-label">
          Label Text
        </label>
        <input
          type="text"
          id="text"
          name="text"
          className="form-control form-control-sm"
          placeholder="Label Text"
          value={path.text}
          onChange={handleChange}
        />
      </div>
      <div className="row">
        <div className="col-6 mb-2">
          <label htmlFor="fontSize" className="form-label">
            Font Size
          </label>
          <input
            type="text"
            id="fontSize"
            name="fontSize"
            className="form-control form-control-sm"
            placeholder="Font Size"
            value={path.fontSize}
            onChange={handleChange}
          />
        </div>
        <div className="col-6 mb-2">
          <label htmlFor="padding" className="form-label">
            Label Padding
          </label>
          <input
            type="text"
            id="padding"
            name="padding"
            className="form-control form-control-sm"
            placeholder="Padding for Label"
            value={path.padding}
            onChange={handleChange}
          />
        </div>
        <div className="col">
          <p className="uuid">Both font size and padding accept CSS format.</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <label htmlFor="color" className="form-label">
            Text Color & Background Color
          </label>
        </div>
        <div className="col-6 mb-2">
          <input
            type="color"
            className="form-control form-control-sm"
            id="color"
            name="color"
            title="Choose text color"
            value={path.color}
            onChange={handleChange}
          />
        </div>
        <div className="col-6 mb-2">
          <input
            type="color"
            className="form-control form-control-sm"
            id="backgroundColor"
            name="backgroundColor"
            title="Choose background color"
            value={path.backgroundColor}
            onChange={handleChange}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default EditorPath;
