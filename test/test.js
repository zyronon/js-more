class LinkNode {
    constructor(val, next) {
        this.val = val;
        this.next = next;
    }
}
var MyLinkedList = function () {
    this.size = 0
    this.node = null
};


MyLinkedList.prototype.getNode = function (index) {
    if (index < 0 || index > this.size) return null
    let cur = new LinkNode(0, this.node);
    // 0 -> head
    while (index-- >= 0) {
        cur = cur.next;
    }
    return cur;
};
/** 
 * @param {number} index
 * @return {number}
 */
MyLinkedList.prototype.get = function (index) {
    if (index < 0 || index >= this.size) return -1;
    return this.getNode(index)?.val
};

/** 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtHead = function (val) {
    this.size++
    if (this.node) {
        this.node = { val, next: this.node }
    } else {
        this.node = { val, next: null }
    }
};

/** 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtTail = function (val) {
    if (this.size) {
        this.size++
        let cur = this.node
        while (cur.next) {
            cur = cur.next
        }
        cur.next = new LinkNode(val, null);
    } else {
        this.addAtHead(val)
    }
};

/** 
 * @param {number} index 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtIndex = function (index, val) {
    if (index < 0 || index > this.size) return
    if (index === 0) {
        this.addAtHead(val)
        return
    }
    if (index === this.size) {
        this.addAtTail(val)
        return
    }
    const node = this.getNode(index - 1);
    node.next = new LinkNode(val, node.next);
    this.size++;
};

/** 
 * @param {number} index
 * @return {void}
 */
MyLinkedList.prototype.deleteAtIndex = function (index) {
    if (index < 0 || index >= this.size || this.size === 0) return
    if (index === 0) {
        this.node = this.node.next
        this.size--;
        return
    }
    const node = this.getNode(index - 1);
    node.next = node.next.next
    this.size--;
};



/** 
 * Your MyLinkedList object will be instantiated and called as such:
 * var obj = new MyLinkedList()
 * var param_1 = obj.get(index)
 * obj.addAtHead(val)
 * obj.addAtTail(val)
 * obj.addAtIndex(index,val)
 * obj.deleteAtIndex(index)
 */

let obj = new MyLinkedList()
obj.addAtHead(2)
obj.deleteAtIndex(1)
obj.addAtHead(2)
obj.addAtHead(7)
obj.addAtHead(3)
obj.addAtHead(2)
obj.addAtHead(5)
obj.addAtTail(5)
obj.get(5)
obj.deleteAtIndex(6) 
obj.deleteAtIndex(4)  


console.time()
console.timeEnd()



