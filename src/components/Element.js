import { Fragment, useCallback, useMemo, useState } from "react";
import { useItem } from "../context/trackerContext";

const baseURL = process.env.PUBLIC_URL;

const nestedStyles = {
  position: "absolute",
  left: "50%",
  transform: "translate(-50%, 0)",
  bottom: "-6px",
};

const Element = props => {
  const {
    id = "7d6ff858445845e5b95db3254e34b0dc",
    name = "Item",
    label = "",
    labelStartingIndex = 0,
    type = "simple", // simple, counter, label, nested
    size = [25, 25], // width, height
    customStyle = {},
    icons = [],
    countConfig = [0, 5], // min, max
    receiver = false, // if draggin overrides item
    dragCurrent = false, // if dragging should default or drag the current selected
    selectedStartingIndex = 0, // on which of the icons we start
    items = [],
  } = props;

  const itemContext = useItem();

  const [selected, setSelected] = useState(selectedStartingIndex);
  const [counter, setCounter] = useState(0);
  const [draggedIcon, setDraggedIcon] = useState(null);

  const icon = useMemo(() => {
    return `${baseURL}/icons/${icons[selected]}`;
  }, [icons, selected]);

  const clickHandler = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();

      const isCounter = !["simple", "nested", "label"].includes(type);
      let updated = isCounter ? counter : selected;

      if (event.nativeEvent.type === "click") {
        if (!isCounter) updated = updated < icons.length - 1 ? ++updated : updated;
        if (isCounter) updated = updated === countConfig[1] ? updated : ++updated;
      } else if (event.nativeEvent.type === "contextmenu") {
        if (!isCounter) updated = updated > 0 ? --updated : updated;
        if (isCounter) updated === countConfig[0] ? updated : --updated;
      }

      // Canceling draggedIcon
      if (!isCounter) {
        setDraggedIcon(null);
        setSelected(updated);
      } else {
        setCounter(updated);
      }

      // For context
      if (!isCounter) {
        itemContext.markItem(items, items[updated]);
      }
    },
    [icons, type, countConfig, selected, items, itemContext, counter],
  );

  const wheelHandler = useCallback(
    event => {
      // event.preventDefault();
      if (type !== "counter") return;

      const { deltaY } = event;
      if (deltaY > 0) {
        setCounter(prev => (prev === countConfig[1] ? prev : ++prev));
      } else if (deltaY < 0) {
        setCounter(prev => (prev === countConfig[0] ? prev : --prev));
      }
    },
    [type, countConfig],
  );

  const dragHandler = useCallback(
    event => {
      let dragIcon = `${baseURL}/icons/${icons[1] || icons[0]}`;
      if (dragCurrent) dragIcon = `${baseURL}/icons/${icons[selected]}`;
      const item = JSON.stringify({ icon: dragIcon });
      event.dataTransfer.setData("item", item);
    },
    [dragCurrent, icons, selected],
  );

  const dropHandler = useCallback(
    event => {
      event.preventDefault();
      if (receiver) {
        const item = event.dataTransfer.getData("item");
        const { icon } = JSON.parse(item);
        setDraggedIcon(icon);
      }
    },
    [receiver],
  );

  return (
    <Fragment>
      <div
        id={id}
        className="element"
        style={{
          width: size[0],
          height: size[1],
          ...customStyle,
        }}
        onClick={clickHandler}
        onContextMenu={clickHandler}
        onWheel={wheelHandler}
        onDragStart={dragHandler}
        onDragEnter={e => e.preventDefault()}
        onDragOver={e => e.preventDefault()}
        onDrop={dropHandler}
        draggable
      >
        <img className="element-icon" src={draggedIcon || icon} alt={name} />
        {type === "counter" && <CounterLabel counter={counter} />}
        {type === "label" && <ElementLabel label={label} labelStartingIndex={labelStartingIndex} />}
        {type === "nested" && (
          <Element
            name={`${name}_nested`}
            type="simple"
            icons={["unknown_16x16.png", "check_16x16.png"]}
            size={[16, 16]}
            customStyle={nestedStyles}
            receiver
          />
        )}
      </div>
    </Fragment>
  );
};

const ElementLabel = ({ label, labelStartingIndex }) => {
  const [index, setIndex] = useState(labelStartingIndex);

  const display = useMemo(() => {
    if (Array.isArray(label)) {
      return label[index];
    }
    return null;
  }, [label, index]);

  const handleOnWheel = useCallback(
    event => {
      const { deltaY } = event;
      const max = label.length - 1 || 0;
      if (deltaY > 0) {
        setIndex(prev => (prev === max ? prev : ++prev));
      } else if (deltaY < 0) {
        setIndex(prev => (prev === 0 ? prev : --prev));
      }
    },
    [label],
  );

  const handleOnClick = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      const max = label.length - 1 || 0;
      if (event.nativeEvent.type === "click") {
        setIndex(prev => (prev === max ? prev : ++prev));
      } else if (event.nativeEvent.type === "contextmenu") {
        setIndex(prev => (prev === 0 ? prev : --prev));
      }
    },
    [label],
  );

  if (!label) return null;
  if (typeof label === "string") {
    return <label className="element-label">{label}</label>;
  } else if (Array.isArray(label)) {
    return (
      <label
        className="element-label"
        style={{ cursor: "pointer" }}
        onWheel={handleOnWheel}
        onClick={handleOnClick}
        onContextMenu={handleOnClick}
      >
        {display}
      </label>
    );
  }
};

const CounterLabel = ({ counter }) => {
  return <label className="element-counter">{counter}</label>;
};

export default Element;
