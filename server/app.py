import os
from flask import Flask, request, jsonify
from flask_cors import CORS 
from collections import defaultdict

# python3 -m flask rungit pu

app = Flask(__name__)
CORS(app)

class TrieNode:
    def __init__(self):
        self.children = defaultdict(TrieNode)
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            node = node.children[char]
        node.is_end_of_word = True
    
    def is_prefix(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True
    
    def is_word(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_endo_of_word

dictionary = Trie()
with open("./dictionary.txt") as f:
    for word in f:
        dictionary.insert(word.strip().lower())

def get_neighbours(i, j, board_size):
    for delta_i in range(-1, 2):
        for delta_j in range(-1, 2):
            if delta_i == 0 and delta_j == 0:
                continue
            next_i, next_j = i + delta_i, j + delta_j
            if 0 <= next_i < board_size and 0 <= next_j < board_size:
                yield next_i, next_j
            
def traverse(grid, i, j, word, visited, solutions, node, path):
    char = grid[i][j]
    word += char
    visited.add((i, j))
    path.append((i, j))
    node = node.children[char]

    if node.is_end_of_word:
        solutions[word] = path.copy() # store if end
    
    for next_i, next_j in get_neighbours(i, j, len(grid)):
        if (next_i, next_j) not in visited and grid[next_i][next_j] in node.children:
            traverse(grid, next_i, next_j, word, visited, solutions, node, path)
    visited.remove((i, j))
    path.pop()

@app.route('/')
def index():
    return "Hello, World! The server is running."

@app.route('/solve', methods=['POST'])
def solve():
    data = request.json
    board = data['board']
    grid = [list(board[i:i+4]) for i in range(0, 16, 4)]
    solutions = {}
    for i in range(4):
        for j in range(4):
            if grid[i][j] in dictionary.root.children:
                traverse(grid, i, j, "", set(), solutions, dictionary.root, [])
    
    # Convert solutions to a list of dictionaries with 'word' and 'path' keys
    sorted_solutions = [
        {'word': word, 'path': path} 
        for word, path in sorted(solutions.items(), key=lambda x: len(x[0]), reverse=True)
    ]
    
    return jsonify(sorted_solutions)


if __name__ == '__main__':
    app.run(debug=True)
