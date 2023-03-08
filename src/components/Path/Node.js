function Node(name, icon) {
    const children = [];
    let parent = null;
  
    const addChild = function(node) {
      node.parent = this;

      children.push(node)
    }
  
    const deleteChild = function(node) {
      const idx = children.findIndex(child => node.name === child.name);
  
      children.splice(idx,1);
    }
  
    const deleteNode = function() {
      this.parent.deleteChild(this)
    }
  
    return {
      name,
      parent,
      icon,
      children,
      addChild,
      deleteChild,
      deleteNode
    }
}

export default Node;