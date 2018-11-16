//树节点增删改

function addToTreeSolo(arr,idValue,node,child,id) {
  arr.forEach((e)=>{
    if(e[id] === idValue){
      e[child].push(node)
    }else{
      if(e[child].length>0){
        addToTree(e[child],idValue,node,child,id)
      }
    }
  })
}
function addToTree(arr,idValue,node,child,id) {
  arr.forEach((e)=>{
    if(e[id] === idValue){
      e[child] = node
    }else{
      if(e[child].length>0){
        addToTree(e[child],idValue,node,child,id)
      }
    }
  })
}


function deleteFromTree(arr,idValue,child,id) {
  arr.forEach((e,index)=>{
    if(e[id] === idValue){
      arr.splice(index,1)
    }else{
      if(e[child].length>0){
        deleteFromTree(e[child],idValue,child,id)
      }
    }
  })
}
function updateToTree(arr,idValue,value,child,id,name) {
  arr.forEach((e)=>{
    if(e[id] === idValue){
      e[name] = value
    }else{
      if(e[child].length>0){
        updateToTree(e[child],idValue,value,child,id,name)
      }
    }
  })
}

export default {
  treeCtrl: {
    addToTreeSolo,
    addToTree,
    deleteFromTree,
    updateToTree
  }
}