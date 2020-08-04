You can 
(1) change the variable 'depth' in luoji.js file to set the levels of the tree.

How to play with the game?

1、You can open the sunbrust.html with a broswer to start the game.

2、This is a two player game, one is red Player, the other is blue player.

3、What are the rules of this game?

3.1 Both players can only click the leaf nodes(Outermost node) in this full binary tree.

3.2 At the beginning of the game, a round should be performed like this way: the red player click a leaf node first,
then the blue player chooses a suitable left node( What's sutiable node? It means the node's color is drak green). 
Then we can start a new round.

3.3 In each round, the red player can only choose the leaf node whose color is light blue(single label) or light purple(the node has two labels), and the blue player can only
choose the leaf node whose color is drak green.

3.4 In the dynamic version, the red player should follow a 3-ouf-of-4 rule, so during the gameing process, some area will
become gray, so the gray area is forbidden for the red player.

3.5 For every choice of the red player, the blue player should choose a suitable choice.( of course, in this game , the suitable or
legit positions will be highlighted before the blue player to do his decision.)
IF the red player chooses a double-labeled node, the blue player should choose two suitable nodes to deal with that. 

3.6 If anyone wants to be able to step back, he can click the undo button.


4、How to judge who wins the game?

If there is no highlighted drak green node for blue player to choose, it means the blue player loses the game.) If the red player has no more light blue nodes to choose, it means
the red player loses the game.

