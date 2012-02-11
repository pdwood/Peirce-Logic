#ifndef GRAPHNODE_H
#define GRAPHNODE_H

#include <vector>
#include <string>

class GraphNode
{
	std::vector<std::string> variables; //Stores variables in the circle (most likly should not be a vector)
										//variables might be better with there own data type
	std::vector<GraphNode *> children;  //Stores children of node
	GraphNode *parent;                  //Points to parent
	
	public:
	GraphNode(GraphNode *);             //Constructer, pass the address of the parent
	//temporary access functions
	std::vector<std::string> &GetVariables() //passes the variables vector
	{
		return variables;
	}
	std::vector<GraphNode *> &GetChildren() //passes the children vector
	{
		return children;
	}
	GraphNode *GetParent() //passes parent pointer
	{
		return parent;
	}
};
	