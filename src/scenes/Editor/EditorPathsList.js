import { useCallback, useEffect, useMemo, useState } from "react";
import { generateId } from "../../utils/utils";
import EditorPath from "./EditorPath";
import elementsJSON from "../../data/elements.json";

const EditorPathsList = ({ paths, setLayout, customElements }) => {
  const [path, setPath] = useState(null);

  const addPath = () => {
    setPath({
      id: generateId(),
      type: "",
      displayName: "",
      position: [0, 0],
    });
  };

  const deletePath = useCallback(() => {
    setLayout(prev => {
      let paths = [...prev.paths.filter(x => x.id !== path.id)];
      return {
        ...prev,
        paths: paths,
      };
    });
    setPath(null);
  }, [path, setLayout]);

  // Any time a component change (coming from EditorComponent)
  // we update layout from EditorLayoutConfig to display the changes in real time
  useEffect(() => {
    if (!path) return;

    setLayout(prev => {
      let paths = [...prev.paths];
      const index = paths.findIndex(x => x.id === path.id);
      if (index !== -1) {
        paths[index] = { ...path };
      } else {
        paths = [...paths, path];
      }
      return {
        ...prev,
        paths: paths,
      };
    });
  }, [path, setLayout]);

  // From default elements and custom in layout
  const combinedElements = useMemo(() => {
    return [...elementsJSON, ...customElements || []];
  }, [customElements]);

  return (
    <div className="path-list">
      <h5>Paths</h5>
      <div className="btn-row mb-2">
        <button type="button" className="btn btn-light btn-sm" onClick={addPath} disabled={path}>
          Add
        </button>
        <button type="button" className="btn btn-light btn-sm" onClick={deletePath} disabled={!path}>
          Delete
        </button>
        <button type="button" className="btn btn-light btn-sm" onClick={() => setPath(null)} disabled={!path}>
          Save
        </button>
      </div>
      {path && (
        <EditorPath path={path} setPath={setPath} combinedElements={combinedElements} />
      )}
      {!path && paths.length < 1 && <p className="uuid my-2">Add a path to start</p>}
      {!path && paths.length > 0 && (
        <ul className="list-unstyled mb-0">
          {!path &&
            paths.length > 0 &&
            paths.map(path => (
              <li key={path.id}>
                <button type="button" className="btn btn-dark btn-sm" onClick={() => setPath(path)}>
                  {path.type || "undefined"} - {path.displayName || path.id.substring(0, 12)}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default EditorPathsList;
