function ListNode(x)
{
	this.val = x;
	this.prev = null;
	this.next = null;
}
function List()
{
	this.head = null;
	this.tail = null;
	this.length = 0;
}
List.prototype.push_back = function (x)
{
	var push = new ListNode(x);
	if(this.tail === null)
	{
		this.head = this.tail = push;
	}else{
		this.tail.next = push;
		push.prev = this.tail;
		this.tail = push;
	}
	this.length++;
}
List.prototype.pop_back = function ()
{
	if(this.tail === null)
	{
		return null;
	}
	var ret = this.tail.val;
	if(this.tail.prev === null)
	{
		this.head = null;
	}else{
		this.tail.prev.next = null;
	}
	this.tail = this.tail.prev;
	this.length--;
	return ret;
}
List.prototype.push_front = function (x)
{
	var push = new ListNode(x);
	if(this.head === null)
	{
		this.head = this.tail = push;
	}else{
		this.head.prev = push;
		push.next = this.head;
		this.head = push;
	}
	this.length++;
}
List.prototype.pop_front = function ()
{
	if(this.head === null)
		return null;
	if(this.head.next === null)
	{
		this.tail = null;
	}else{
		this.head.next.prev = null;
	}
	var ret = this.head.val;
	this.head = this.head.next;
	this.length--;
}
List.prototype.erase = function(p) //returns pointer to next in list
{
	if(p === null)
		return null;
	if(p.next !== null)
		p.next.prev = p.prev;
	if(p.prev !== null)
		p.prev.next = p.next;
	if(this.head == p)
		this.head = p.next;
	if(this.tail == p)
		this.tail = p.prev;
	this.length--;
	return p.next;
}
List.prototype.insert = function(p,x) //inserts x after p, returns where x was inserted
{
	if(p === null || p.next === null)
	{
		this.push_back(x);
		return this.tail;
	}
	var add = new ListNode(x);
	p.next.prev = add;
	add.next = p.next;
	p.next = add;
	add.prev = p;
	this.length++;
	return add;
}
List.prototype.begin = function ()
{
	return this.head;
}
List.prototype.rbegin = function ()
{
	return this.tail;
}
List.prototype.end = function ()
{
	return null;
}