export const GREEDY_DP_ALGORITHMS = [
  {
    id: 'fractional-knapsack',
    name: 'Fractional Knapsack',
    category: 'Greedy Algorithm',
    badge: 'Greedy',
    tagline: 'Greedily selects items with the highest value-to-weight ratio, taking fractional portions when full items cannot fit.',
    shortDescription: 'Maximizes total profit within a weight capacity by sorting items by value-to-weight ratio and accepting fractions.',
    introduction: `The Fractional Knapsack problem is a classic optimization problem solved using the Greedy algorithmic paradigm. Given a set of items, each with a specific weight and profit value, along with a container (knapsack) of maximum weight capacity W, the goal is to determine the collection of items that maximizes the total profit without exceeding the capacity.

Unlike the 0/1 Knapsack problem (which requires Dynamic Programming because items must be taken entirely or left behind), the Fractional Knapsack problem permits taking arbitrary fractional portions (0 ≤ x_i ≤ 1) of any item. This fractional property gives the problem the "greedy-choice property," meaning locally optimal choices at each step lead to a globally optimal solution.`,
    workingPrinciple: `The algorithm operates on a simple yet mathematically proven greedy choice: prioritize items that provide the highest value per unit of weight.

1. Ratio Computation: For every item i, compute its value-to-weight ratio: r_i = v_i / w_i. This represents the profit density of the item.
2. Descending Sort: Sort all items in non-increasing (descending) order of their ratios: r_1 ≥ r_2 ≥ ... ≥ r_n.
3. Greedy Selection: Iterate through the sorted items:
   - If the current item's weight fits completely in the remaining knapsack capacity (w_i ≤ W_remaining), take 100% of the item (x_i = 1).
   - If the item cannot fit completely (w_i > W_remaining) and remaining capacity W_remaining > 0, take a fraction x_i = W_remaining / w_i. This fills the knapsack to capacity and terminates the loop.
   - Any remaining items are rejected (x_i = 0).`,
    algorithmSteps: [
      'Input the list of items with their respective weights and values, and the maximum knapsack capacity W.',
      'Calculate the value-to-weight ratio r_i = value_i / weight_i for each item.',
      'Sort all items in descending order based on their value-to-weight ratios.',
      'Initialize totalWeight = 0, totalProfit = 0, and remainingCapacity = W.',
      'For each item in the sorted list:',
      '  a. If remainingCapacity == 0, break loop.',
      '  b. If item.weight <= remainingCapacity:',
      '       Take the full item: fraction = 1.0.',
      '       totalProfit += item.value.',
      '       remainingCapacity -= item.weight.',
      '  c. Else (item.weight > remainingCapacity):',
      '       Take fraction = remainingCapacity / item.weight.',
      '       totalProfit += item.value * fraction.',
      '       remainingCapacity = 0.',
      'Return totalProfit, totalWeight, and the set of selected items with their fractions.'
    ],
    pseudocode: `algorithm FractionalKnapsack(weights, values, capacity, n):
    // Step 1: Calculate ratios and create item tuples
    for i = 0 to n - 1:
        items[i] = (weight: weights[i], value: values[i], ratio: values[i] / weights[i], id: i)
    
    // Step 2: Sort descending by ratio
    sort(items, descending by ratio)
    
    totalProfit = 0.0
    remainingCapacity = capacity
    
    // Step 3: Greedily pick items
    for i = 0 to n - 1:
        if remainingCapacity == 0:
            break
            
        if items[i].weight <= remainingCapacity:
            // Take full item
            totalProfit = totalProfit + items[i].value
            remainingCapacity = remainingCapacity - items[i].weight
            items[i].fraction = 1.0
        else:
            // Take fractional portion
            fraction = remainingCapacity / items[i].weight
            totalProfit = totalProfit + (items[i].value * fraction)
            remainingCapacity = 0
            items[i].fraction = fraction
            break
            
    return totalProfit`,
    mathematicalFormulas: [
      {
        name: 'Value-to-Weight Ratio',
        formula: 'r_i = \\frac{v_i}{w_i}',
        description: 'Quantifies profit density per unit weight for item i.'
      },
      {
        name: 'Fraction Calculation',
        formula: 'x_i = \\frac{W_{\\text{remaining}}}{w_i} \\quad (0 \\le x_i \\le 1)',
        description: 'Determines the fractional proportion taken when an item cannot fit completely.'
      },
      {
        name: 'Objective Maximization Function',
        formula: '\\max \\sum_{i=1}^{n} (v_i \\cdot x_i) \\quad \\text{subject to} \\quad \\sum_{i=1}^{n} (w_i \\cdot x_i) \\le W',
        description: 'Standard optimization formulation for the Fractional Knapsack Problem.'
      }
    ],
    complexity: {
      timeBest: 'O(n log n)',
      timeAverage: 'O(n log n)',
      timeWorst: 'O(n log n)',
      space: 'O(n)'
    },
    sampleInputOutput: {
      input: `Capacity W = 50
Items:
Item 1: Weight = 10, Value = 60
Item 2: Weight = 20, Value = 100
Item 3: Weight = 30, Value = 120`,
      output: `Ratios:
Item 1: 60 / 10 = 6.0
Item 2: 100 / 20 = 5.0
Item 3: 120 / 30 = 4.0

Selection:
1. Take Item 1 (Full): Weight = 10, Profit = 60, Remaining Capacity = 40
2. Take Item 2 (Full): Weight = 20, Profit = 100, Remaining Capacity = 20
3. Take Item 3 (Fraction 20/30 = 2/3): Weight = 20, Profit = 80, Remaining Capacity = 0

Total Weight: 50
Maximum Profit: 240.00`
    },
    advantages: [
      'Guaranteed to produce an exact optimal solution (unlike 0/1 knapsack where greedy is a heuristic).',
      'Extremely fast execution with O(n log n) time complexity dominated solely by sorting.',
      'Space-efficient O(n) storage.',
      'Intuitive economic model: always take the highest value per kilogram/pound first.'
    ],
    disadvantages: [
      'Only applicable when items are divisible (e.g., liquids, powders, commodities, bandwidth).',
      'Cannot be applied to discrete indivisible goods (e.g., laptops, vehicles, whole furniture).',
      'Requires pre-sorting all elements before processing.'
    ],
    realWorldApplications: [
      'Cargo Loading & Logistics: Packing bulk agricultural commodities (grain, flour, oil) to maximize transport profit.',
      'Network Bandwidth Allocation: Allocating channel bandwidth to different data streams prioritized by throughput quality.',
      'Financial Portfolio Management: Allocating continuous investment capital across assets ordered by expected return per unit risk.',
      'Mining and Refining: Choosing ore batches based on mineral extraction concentration vs processing weight.'
    ],
    implementations: {
      c: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    double weight;
    double value;
    double ratio;
    double fraction;
} Item;

// Comparison function for qsort in descending order of ratio
int compareItems(const void *a, const void *b) {
    Item *itemA = (Item *)a;
    Item *itemB = (Item *)b;
    if (itemB->ratio > itemA->ratio) return 1;
    if (itemB->ratio < itemA->ratio) return -1;
    return 0;
}

double fractionalKnapsack(Item items[], int n, double capacity) {
    // Compute ratios
    for (int i = 0; i < n; i++) {
        items[i].ratio = items[i].value / items[i].weight;
        items[i].fraction = 0.0;
    }

    // Sort items by ratio descending
    qsort(items, n, sizeof(Item), compareItems);

    double totalProfit = 0.0;
    double remainingCapacity = capacity;

    for (int i = 0; i < n; i++) {
        if (remainingCapacity <= 0) break;

        if (items[i].weight <= remainingCapacity) {
            items[i].fraction = 1.0;
            totalProfit += items[i].value;
            remainingCapacity -= items[i].weight;
        } else {
            items[i].fraction = remainingCapacity / items[i].weight;
            totalProfit += items[i].value * items[i].fraction;
            remainingCapacity = 0;
            break;
        }
    }
    return totalProfit;
}

int main() {
    Item items[] = {
        {1, 10, 60, 0, 0},
        {2, 20, 100, 0, 0},
        {3, 30, 120, 0, 0}
    };
    int n = sizeof(items) / sizeof(items[0]);
    double capacity = 50.0;

    double maxProfit = fractionalKnapsack(items, n, capacity);
    printf("Maximum profit = %.2f\\n", maxProfit);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>

struct Item {
    int id;
    double weight;
    double value;
    double ratio;
    double fraction = 0.0;
};

double fractionalKnapsack(std::vector<Item>& items, double capacity) {
    for (auto& item : items) {
        item.ratio = item.value / item.weight;
    }

    // Sort items descending by value-to-weight ratio
    std::sort(items.begin(), items.end(), [](const Item& a, const Item& b) {
        return a.ratio > b.ratio;
    });

    double totalProfit = 0.0;
    double remaining = capacity;

    for (auto& item : items) {
        if (remaining <= 0) break;

        if (item.weight <= remaining) {
            item.fraction = 1.0;
            totalProfit += item.value;
            remaining -= item.weight;
        } else {
            item.fraction = remaining / item.weight;
            totalProfit += item.value * item.fraction;
            remaining = 0;
            break;
        }
    }

    return totalProfit;
}

int main() {
    std::vector<Item> items = {
        {1, 10, 60, 0},
        {2, 20, 100, 0},
        {3, 30, 120, 0}
    };
    double capacity = 50.0;

    double maxProfit = fractionalKnapsack(items, capacity);
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Maximum Profit: " << maxProfit << std::endl;
    return 0;
}`,
      java: `import java.util.Arrays;

class Item {
    int id;
    double weight;
    double value;
    double ratio;
    double fraction;

    public Item(int id, double weight, double value) {
        this.id = id;
        this.weight = weight;
        this.value = value;
        this.ratio = value / weight;
        this.fraction = 0.0;
    }
}

public class FractionalKnapsack {
    public static double getMaxValue(Item[] items, double capacity) {
        // Sort descending by ratio
        Arrays.sort(items, (a, b) -> Double.compare(b.ratio, a.ratio));

        double totalProfit = 0.0;
        double remainingCapacity = capacity;

        for (Item item : items) {
            if (remainingCapacity <= 0) break;

            if (item.weight <= remainingCapacity) {
                item.fraction = 1.0;
                totalProfit += item.value;
                remainingCapacity -= item.weight;
            } else {
                item.fraction = remainingCapacity / item.weight;
                totalProfit += item.value * item.fraction;
                remainingCapacity = 0;
                break;
            }
        }

        return totalProfit;
    }

    public static void main(String[] args) {
        Item[] items = {
            new Item(1, 10, 60),
            new Item(2, 20, 100),
            new Item(3, 30, 120)
        };
        double capacity = 50;
        double maxProfit = getMaxValue(items, capacity);
        System.out.printf("Maximum Profit = %.2f%n", maxProfit);
    }
}`,
      python: `from dataclasses import dataclass
from typing import List

@dataclass
class Item:
    item_id: int
    weight: float
    value: float
    ratio: float = 0.0
    fraction: float = 0.0

def fractional_knapsack(items: List[Item], capacity: float) -> float:
    # Compute ratio and sort descending
    for item in items:
        item.ratio = item.value / item.weight
    
    items.sort(key=lambda x: x.ratio, reverse=True)
    
    total_profit = 0.0
    remaining_capacity = capacity
    
    for item in items:
        if remaining_capacity <= 0:
            break
            
        if item.weight <= remaining_capacity:
            item.fraction = 1.0
            total_profit += item.value
            remaining_capacity -= item.weight
        else:
            item.fraction = remaining_capacity / item.weight
            total_profit += item.value * item.fraction
            remaining_capacity = 0
            break
            
    return total_profit

if __name__ == '__main__':
    items = [
        Item(1, 10, 60),
        Item(2, 20, 100),
        Item(3, 30, 120)
    ]
    capacity = 50.0
    profit = fractional_knapsack(items, capacity)
    print(f"Maximum Profit: {profit:.2f}")`
    }
  },
  {
    id: 'huffman-coding',
    name: 'Huffman Coding',
    category: 'Greedy Algorithm',
    badge: 'Greedy',
    tagline: 'Generates optimal prefix codes using a priority queue to achieve lossless variable-length data compression.',
    shortDescription: 'Constructs an optimal binary prefix tree by greedily combining the two least frequent nodes iteratively.',
    introduction: `Huffman Coding is a foundational greedy algorithm developed by David Huffman in 1952 for lossless data compression. It assigns variable-length binary codes to input characters based on their frequencies of occurrence.

In standard fixed-length encoding (like ASCII or UTF-8), every character requires an identical number of bits (e.g., 8 bits per character). In natural languages, however, certain characters (like 'E', 'A', 'T') appear far more frequently than others (like 'Q', 'Z', 'X'). Huffman Coding exploits this skewness by assigning shorter binary codes to frequent characters and longer codes to rarer characters, minimizing the expected bit length of the encoded message.

Crucially, Huffman codes are prefix codes (no code is a prefix of any other code), which guarantees unique and instantaneous decodability without special delimiters.`,
    workingPrinciple: `The algorithm constructs a binary tree from the bottom up using a Min-Priority Queue:

1. Frequency Analysis: Count the frequency of every distinct character in the message.
2. Leaf Node Creation: For each distinct character, create a leaf tree node with its frequency.
3. Min-Priority Queue: Enqueue all leaf nodes into a min-priority queue keyed by frequency.
4. Greedy Iterative Merging:
   - Extract the two nodes with lowest frequencies (say node_L and node_R).
   - Create an internal parent node with frequency = node_L.freq + node_R.freq.
   - Assign node_L as left child (edge '0') and node_R as right child (edge '1').
   - Insert the new parent node back into the priority queue.
   - Repeat until only one single root node remains.
5. Code Assignment: Traverse from root to each leaf node; going left appends '0', going right appends '1'.
6. Deterministic Tie-Breaking: When frequencies match, tie-breaking by character alphabetical order ensures predictable, reproducible trees.`,
    algorithmSteps: [
      'Input the text string or character-frequency distribution.',
      'Count frequencies of all distinct characters.',
      'Create a leaf node for each character and insert all nodes into a Min-Priority Queue.',
      'While the priority queue contains more than one node:',
      '  a. Remove the node with the smallest frequency as leftChild.',
      '  b. Remove the next node with the smallest frequency as rightChild.',
      '  c. Create a new internal node with frequency = leftChild.freq + rightChild.freq.',
      '  d. Set leftChild and rightChild as children of the new node.',
      '  e. Reinsert the new internal node into the priority queue.',
      'The single remaining node in the queue becomes the root of the Huffman Tree.',
      'Traverse the tree from the root to each leaf node, recording 0 for left turns and 1 for right turns, generating the prefix code for each character.',
      'Encode the original message by replacing each character with its Huffman code.',
      'Calculate bit savings and compression ratio compared to fixed-width encoding.'
    ],
    pseudocode: `algorithm HuffmanCoding(C: set of characters with frequencies):
    n = |C|
    Q = MinPriorityQueue()
    
    for each c in C:
        node = new Node(char: c.char, freq: c.freq, left: null, right: null)
        Q.insert(node)
        
    for i = 1 to n - 1:
        left = Q.extractMin()
        right = Q.extractMin()
        
        parent = new Node(
            char: null,
            freq: left.freq + right.freq,
            left: left,
            right: right
        )
        Q.insert(parent)
        
    root = Q.extractMin()
    codes = generateCodes(root, currentCode="")
    return (root, codes)`,
    mathematicalFormulas: [
      {
        name: 'Weighted Path Length (Total Compressed Bits)',
        formula: 'B = \\sum_{i=1}^{n} (f_i \\cdot L(c_i))',
        description: 'Total bits required, where f_i is frequency and L(c_i) is bit length of code for character c_i.'
      },
      {
        name: 'Fixed-Length Bit Count (8-bit ASCII)',
        formula: 'B_{\\text{original}} = 8 \\cdot \\sum_{i=1}^{n} f_i',
        description: 'Baseline bit count using standard 8-bit uncompressed ASCII encoding.'
      },
      {
        name: 'Compression Ratio',
        formula: '\\text{CR} = \\left(1 - \\frac{B_{\\text{compressed}}}{B_{\\text{original}}}\\right) \\times 100\\%',
        description: 'Percentage of storage space saved via Huffman compression.'
      }
    ],
    complexity: {
      timeBest: 'O(n log n)',
      timeAverage: 'O(n log n)',
      timeWorst: 'O(n log n)',
      space: 'O(n)'
    },
    sampleInputOutput: {
      input: `Characters & Frequencies:
A: 5, B: 9, C: 12, D: 13, E: 16, F: 45`,
      output: `Step-by-step Merges:
1. Merge A(5) + B(9) -> (14)
2. Merge C(12) + D(13) -> (25)
3. Merge (14) + E(16) -> (30)
4. Merge (25) + (30) -> (55)
5. Merge F(45) + (55) -> Root(100)

Generated Binary Codes:
F: 0        (1 bit)
C: 100      (3 bits)
D: 101      (3 bits)
A: 1100     (4 bits)
B: 1101     (4 bits)
E: 111      (3 bits)

Total Original Bits (8-bit): 100 × 8 = 800 bits
Total Compressed Bits: 45(1) + 12(3) + 13(3) + 5(4) + 9(4) + 16(3) = 224 bits
Space Saved: 72.00%`
    },
    advantages: [
      'Mathematically optimal among all symbol-by-symbol prefix codes.',
      'Lossless: original data is reconstructed 100% faithfully upon decoding.',
      'Self-delimiting prefix property: no end-of-character markers required.',
      'Significant bandwidth and storage reduction for skewed data distributions.'
    ],
    disadvantages: [
      'Two-pass requirement: must scan data once to measure frequencies, then a second time to encode.',
      'Tree storage overhead: the decoding tree or frequency table must be transmitted alongside the compressed bits.',
      'Cannot compress uniformly distributed or high-entropy random data.'
    ],
    realWorldApplications: [
      'Multimedia Compression Standards: Core final entropy stage in JPEG image compression and MP3 audio encoding.',
      'Archive Formats: Used in DEFLATE algorithm inside ZIP, GZIP, and PNG formats.',
      'Network Transmission: Reducing payload size across bandwidth-constrained telemetry systems.',
      'Genomics: Compressing DNA nucleotide sequences (A, C, G, T) with highly skewed segment distributions.'
    ],
    implementations: {
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct MinHeapNode {
    char data;
    unsigned freq;
    struct MinHeapNode *left, *right;
};

struct MinHeap {
    unsigned size;
    unsigned capacity;
    struct MinHeapNode** array;
};

struct MinHeapNode* newNode(char data, unsigned freq) {
    struct MinHeapNode* temp = (struct MinHeapNode*)malloc(sizeof(struct MinHeapNode));
    temp->left = temp->right = NULL;
    temp->data = data;
    temp->freq = freq;
    return temp;
}

struct MinHeap* createMinHeap(unsigned capacity) {
    struct MinHeap* minHeap = (struct MinHeap*)malloc(sizeof(struct MinHeap));
    minHeap->size = 0;
    minHeap->capacity = capacity;
    minHeap->array = (struct MinHeapNode**)malloc(minHeap->capacity * sizeof(struct MinHeapNode*));
    return minHeap;
}

void swapNode(struct MinHeapNode** a, struct MinHeapNode** b) {
    struct MinHeapNode* t = *a;
    *a = *b;
    *b = t;
}

void minHeapify(struct MinHeap* minHeap, int idx) {
    int smallest = idx;
    int left = 2 * idx + 1;
    int right = 2 * idx + 2;

    if (left < minHeap->size && minHeap->array[left]->freq < minHeap->array[smallest]->freq)
        smallest = left;
    if (right < minHeap->size && minHeap->array[right]->freq < minHeap->array[smallest]->freq)
        smallest = right;

    if (smallest != idx) {
        swapNode(&minHeap->array[smallest], &minHeap->array[idx]);
        minHeapify(minHeap, smallest);
    }
}

struct MinHeapNode* extractMin(struct MinHeap* minHeap) {
    struct MinHeapNode* temp = minHeap->array[0];
    minHeap->array[0] = minHeap->array[minHeap->size - 1];
    --minHeap->size;
    minHeapify(minHeap, 0);
    return temp;
}

void insertMinHeap(struct MinHeap* minHeap, struct MinHeapNode* node) {
    ++minHeap->size;
    int i = minHeap->size - 1;
    while (i && node->freq < minHeap->array[(i - 1) / 2]->freq) {
        minHeap->array[i] = minHeap->array[(i - 1) / 2];
        i = (i - 1) / 2;
    }
    minHeap->array[i] = node;
}

struct MinHeapNode* buildHuffmanTree(char data[], int freq[], int size) {
    struct MinHeap* minHeap = createMinHeap(size);
    for (int i = 0; i < size; ++i)
        insertMinHeap(minHeap, newNode(data[i], freq[i]));

    while (minHeap->size != 1) {
        struct MinHeapNode* left = extractMin(minHeap);
        struct MinHeapNode* right = extractMin(minHeap);
        struct MinHeapNode* top = newNode('$', left->freq + right->freq);
        top->left = left;
        top->right = right;
        insertMinHeap(minHeap, top);
    }
    return extractMin(minHeap);
}

void printCodes(struct MinHeapNode* root, int arr[], int top) {
    if (root->left) {
        arr[top] = 0;
        printCodes(root->left, arr, top + 1);
    }
    if (root->right) {
        arr[top] = 1;
        printCodes(root->right, arr, top + 1);
    }
    if (!root->left && !root->right) {
        printf("%c: ", root->data);
        for (int i = 0; i < top; ++i) printf("%d", arr[i]);
        printf("\\n");
    }
}

int main() {
    char arr[] = { 'A', 'B', 'C', 'D', 'E', 'F' };
    int freq[] = { 5, 9, 12, 13, 16, 45 };
    int size = sizeof(arr) / sizeof(arr[0]);
    struct MinHeapNode* root = buildHuffmanTree(arr, freq, size);
    int codeArr[100], top = 0;
    printf("Huffman Codes:\\n");
    printCodes(root, codeArr, top);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <map>

struct Node {
    char ch;
    int freq;
    Node *left, *right;
    Node(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
    Node(int f, Node* l, Node* r) : ch('\\0'), freq(f), left(l), right(r) {}
};

struct Compare {
    bool operator()(Node* l, Node* r) {
        return l->freq > r->freq;
    }
};

void generateCodes(Node* root, const std::string& code, std::map<char, std::string>& huffmanCodes) {
    if (!root) return;
    if (!root->left && !root->right) {
        huffmanCodes[root->ch] = code;
    }
    generateCodes(root->left, code + "0", huffmanCodes);
    generateCodes(root->right, code + "1", huffmanCodes);
}

int main() {
    std::vector<std::pair<char, int>> data = {
        {'A', 5}, {'B', 9}, {'C', 12}, {'D', 13}, {'E', 16}, {'F', 45}
    };

    std::priority_queue<Node*, std::vector<Node*>, Compare> pq;
    for (auto& p : data) {
        pq.push(new Node(p.first, p.second));
    }

    while (pq.size() > 1) {
        Node* left = pq.top(); pq.pop();
        Node* right = pq.top(); pq.pop();
        Node* parent = new Node(left->freq + right->freq, left, right);
        pq.push(parent);
    }

    Node* root = pq.top();
    std::map<char, std::string> huffmanCodes;
    generateCodes(root, "", huffmanCodes);

    std::cout << "Huffman Codes:\\n";
    for (auto& p : huffmanCodes) {
        std::cout << p.first << ": " << p.second << "\\n";
    }
    return 0;
}`,
      java: `import java.util.PriorityQueue;
import java.util.HashMap;
import java.util.Map;

class HuffmanNode implements Comparable<HuffmanNode> {
    int freq;
    char data;
    HuffmanNode left, right;

    public HuffmanNode(char data, int freq) {
        this.data = data;
        this.freq = freq;
    }

    public HuffmanNode(int freq, HuffmanNode left, HuffmanNode right) {
        this.data = '\\0';
        this.freq = freq;
        this.left = left;
        this.right = right;
    }

    @Override
    public int compareTo(HuffmanNode o) {
        return Integer.compare(this.freq, o.freq);
    }
}

public class HuffmanCoding {
    public static void buildCodes(HuffmanNode node, String code, Map<Character, String> map) {
        if (node == null) return;
        if (node.left == null && node.right == null) {
            map.put(node.data, code);
            return;
        }
        buildCodes(node.left, code + "0", map);
        buildCodes(node.right, code + "1", map);
    }

    public static void main(String[] args) {
        char[] chars = { 'A', 'B', 'C', 'D', 'E', 'F' };
        int[] freqs = { 5, 9, 12, 13, 16, 45 };

        PriorityQueue<HuffmanNode> pq = new PriorityQueue<>();
        for (int i = 0; i < chars.length; i++) {
            pq.add(new HuffmanNode(chars[i], freqs[i]));
        }

        while (pq.size() > 1) {
            HuffmanNode left = pq.poll();
            HuffmanNode right = pq.poll();
            HuffmanNode parent = new HuffmanNode(left.freq + right.freq, left, right);
            pq.add(parent);
        }

        HuffmanNode root = pq.peek();
        Map<Character, String> codeMap = new HashMap<>();
        buildCodes(root, "", codeMap);

        System.out.println("Huffman Codes:");
        codeMap.forEach((k, v) -> System.out.println(k + ": " + v));
    }
}`,
      python: `import heapq
from typing import Dict, Optional

class Node:
    def __init__(self, char: Optional[str], freq: int):
        self.char = char
        self.freq = freq
        self.left: Optional[Node] = None
        self.right: Optional[Node] = None

    def __lt__(self, other: 'Node') -> bool:
        if self.freq == other.freq:
            # Deterministic tie-breaker
            return (self.char or '') < (other.char or '')
        return self.freq < other.freq

def build_huffman_tree(frequencies: Dict[str, int]) -> Optional[Node]:
    heap = [Node(char, freq) for char, freq in frequencies.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        parent = Node(None, left.freq + right.freq)
        parent.left = left
        parent.right = right
        heapq.heappush(heap, parent)

    return heap[0] if heap else None

def generate_codes(root: Optional[Node], prefix: str = "", codes: Optional[Dict[str, str]] = None) -> Dict[str, str]:
    if codes is None:
        codes = {}
    if root:
        if root.char is not None:
            codes[root.char] = prefix or "0"
        generate_codes(root.left, prefix + "0", codes)
        generate_codes(root.right, prefix + "1", codes)
    return codes

if __name__ == '__main__':
    data = {'A': 5, 'B': 9, 'C': 12, 'D': 13, 'E': 16, 'F': 45}
    tree = build_huffman_tree(data)
    huffman_codes = generate_codes(tree)
    print("Huffman Codes:")
    for char, code in sorted(huffman_codes.items()):
        print(f"{char}: {code}")`
    }
  },
  {
    id: 'activity-selection',
    name: 'Activity Selection',
    category: 'Greedy Algorithm',
    badge: 'Greedy',
    tagline: 'Greedily selects the maximum number of mutually compatible activities by prioritizing earliest finish times.',
    shortDescription: 'Schedules optimal non-overlapping activities using a single shared resource by sorting by finish times.',
    introduction: `The Activity Selection Problem is a classic interval scheduling optimization challenge. You are given a set of n proposed activities S = {A_1, A_2, ..., A_n}, each with a specific start time s_i and finish time f_i (where s_i < f_i). These activities must all execute on a single, shared, non-preemptible resource (such as a lecture hall, conference room, or CPU core).

Two activities A_i and A_j are compatible if their time intervals do not overlap, meaning either s_i ≥ f_j or s_j ≥ f_i. The goal is to select the largest possible subset of mutually compatible activities to maximize resource utilization count.

Because sorting by earliest finish time leaves the maximum possible remaining time for subsequent activities, this problem exhibits optimal substructure and satisfies the greedy-choice property.`,
    workingPrinciple: `The algorithm applies the intuitive greedy heuristic: the activity that finishes earliest leaves the greatest amount of remaining time for other activities.

1. Sort by Finish Time: Sort all n activities in non-decreasing (increasing) order of their finish times: f_1 ≤ f_2 ≤ ... ≤ f_n.
2. Select First Activity: Greedily pick the first activity A_1 (the one that finishes first among all candidates) and mark its finish time as lastSelectedFinish = f_1.
3. Linear Scan & Compatibility Evaluation:
   - For each subsequent activity A_k (from 2 to n):
     - Compare its start time with the current boundary: s_k ≥ lastSelectedFinish.
     - If true: The activity does not conflict with previously scheduled tasks! Accept A_k, add it to the schedule, and advance the marker: lastSelectedFinish = f_k.
     - If false: The activity overlaps with an already scheduled task. Reject A_k and proceed to the next.
4. Termination: Return the selected set of compatible activities.`,
    algorithmSteps: [
      'Input the list of activities with their respective start times and finish times.',
      'Sort all activities in increasing order of their finish times.',
      'Select the first activity (index 0) since it finishes earliest.',
      'Add the first activity to the selected list and set lastFinish = activity[0].finish.',
      'Iterate through the remaining activities from index 1 to n - 1:',
      '  a. If currentActivity.start >= lastFinish:',
      '       Accept the activity (no overlap).',
      '       Add currentActivity to the selected list.',
      '       Update lastFinish = currentActivity.finish.',
      '  b. Else:',
      '       Reject the activity due to time overlap conflict.',
      'Return the list of selected activities and the total count.'
    ],
    pseudocode: `algorithm ActivitySelection(startTimes, finishTimes, n):
    // Pair each activity with id, start, and finish
    for i = 0 to n - 1:
        activities[i] = (id: i + 1, start: startTimes[i], finish: finishTimes[i])
        
    // Sort activities by finish time ascending
    sort(activities, ascending by finish)
    
    selected = []
    
    // Always select the first activity
    selected.append(activities[0])
    lastFinish = activities[0].finish
    
    // Evaluate remaining activities
    for i = 1 to n - 1:
        if activities[i].start >= lastFinish:
            selected.append(activities[i])
            lastFinish = activities[i].finish
        else:
            // Conflict detected: reject
            continue
            
    return selected`,
    mathematicalFormulas: [
      {
        name: 'Compatibility Condition',
        formula: 's_i \\ge f_{\\text{last}}',
        description: 'An activity i is mutually compatible with the current schedule if its start time s_i is at or after the finish time of the last scheduled activity.'
      },
      {
        name: 'Optimization Goal',
        formula: '\\max |S_{\\text{selected}}| \\quad \\text{where} \\quad [s_i, f_i) \\cap [s_j, f_j) = \\emptyset \\quad \\forall i \\ne j',
        description: 'Maximize the cardinality of the mutually non-overlapping activity subset.'
      }
    ],
    complexity: {
      timeBest: 'O(n log n)',
      timeAverage: 'O(n log n)',
      timeWorst: 'O(n log n)',
      space: 'O(n)'
    },
    sampleInputOutput: {
      input: `Activities (Start, Finish):
A1: (1, 4)
A2: (3, 5)
A3: (0, 6)
A4: (5, 7)
A5: (8, 9)
A6: (5, 9)`,
      output: `Step 1: Sorted by Finish Time:
A1: (1, 4)
A2: (3, 5)
A3: (0, 6)
A4: (5, 7)
A5: (8, 9)
A6: (5, 9)

Step 2: Greedily Select Activities:
- Select A1 (1, 4): lastFinish = 4
- Reject A2 (3, 5): Start 3 < lastFinish 4 (Conflict!)
- Reject A3 (0, 6): Start 0 < lastFinish 4 (Conflict!)
- Select A4 (5, 7): Start 5 >= lastFinish 4 -> Selected! lastFinish = 7
- Select A5 (8, 9): Start 8 >= lastFinish 7 -> Selected! lastFinish = 9
- Reject A6 (5, 9): Start 5 < lastFinish 9 (Conflict!)

Total Selected: 3 Activities [A1, A4, A5]`
    },
    advantages: [
      'Guaranteed global optimum: proven by mathematical induction via exchange argument.',
      'Extremely high runtime performance: after initial sorting, requires a single linear O(n) pass.',
      'Minimal memory overhead: in-place sorting or O(n) auxiliary list.',
      'Transparent logic: straightforward decision criteria for each event.'
    ],
    disadvantages: [
      'Assumes all activities hold equal weight/value (cannot handle weighted activities without DP).',
      'Requires pre-sorting all activities upfront.',
      'Single resource only (multi-machine scheduling requires min-heap interval partitioning).'
    ],
    realWorldApplications: [
      'Room & Venue Booking: Scheduling non-conflicting reservations for university lecture halls and auditoriums.',
      'Flight & Train Runway Allocation: Scheduling airport runway takeoffs and landings without mid-air collision risks.',
      'Operating System Process Scheduling: Selecting uniprocessor non-preemptive job batches.',
      'Telescope & Satellite Operations: Maximizing the count of astronomical observation windows scheduled on space telescopes.'
    ],
    implementations: {
      c: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    int start;
    int finish;
} Activity;

int compareActivities(const void *a, const void *b) {
    Activity *actA = (Activity *)a;
    Activity *actB = (Activity *)b;
    return actA->finish - actB->finish;
}

void selectActivities(Activity activities[], int n) {
    // Sort activities by finish time ascending
    qsort(activities, n, sizeof(Activity), compareActivities);

    printf("Selected Activities:\\n");
    // Select first activity
    int count = 1;
    printf("Activity A%d (Start: %d, Finish: %d)\\n", activities[0].id, activities[0].start, activities[0].finish);
    int lastFinish = activities[0].finish;

    for (int i = 1; i < n; i++) {
        if (activities[i].start >= lastFinish) {
            printf("Activity A%d (Start: %d, Finish: %d)\\n", activities[i].id, activities[i].start, activities[i].finish);
            lastFinish = activities[i].finish;
            count++;
        }
    }
    printf("Total maximum compatible activities: %d\\n", count);
}

int main() {
    Activity acts[] = {
        {1, 1, 4}, {2, 3, 5}, {3, 0, 6},
        {4, 5, 7}, {5, 8, 9}, {6, 5, 9}
    };
    int n = sizeof(acts) / sizeof(acts[0]);
    selectActivities(acts, n);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

struct Activity {
    int id;
    int start;
    int finish;
};

void activitySelection(std::vector<Activity>& acts) {
    std::sort(acts.begin(), acts.end(), [](const Activity& a, const Activity& b) {
        return a.finish < b.finish;
    });

    std::vector<Activity> selected;
    selected.push_back(acts[0]);
    int lastFinish = acts[0].finish;

    for (size_t i = 1; i < acts.size(); ++i) {
        if (acts[i].start >= lastFinish) {
            selected.push_back(acts[i]);
            lastFinish = acts[i].finish;
        }
    }

    std::cout << "Selected Activities (" << selected.size() << "):\\n";
    for (const auto& a : selected) {
        std::cout << "A" << a.id << " [" << a.start << ", " << a.finish << "]\\n";
    }
}

int main() {
    std::vector<Activity> acts = {
        {1, 1, 4}, {2, 3, 5}, {3, 0, 6},
        {4, 5, 7}, {5, 8, 9}, {6, 5, 9}
    };
    activitySelection(acts);
    return 0;
}`,
      java: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Activity {
    int id;
    int start;
    int finish;

    public Activity(int id, int start, int finish) {
        this.id = id;
        this.start = start;
        this.finish = finish;
    }
}

public class ActivitySelection {
    public static List<Activity> selectActivities(Activity[] acts) {
        Arrays.sort(acts, (a, b) -> Integer.compare(a.finish, b.finish));

        List<Activity> selected = new ArrayList<>();
        selected.add(acts[0]);
        int lastFinish = acts[0].finish;

        for (int i = 1; i < acts.length; i++) {
            if (acts[i].start >= lastFinish) {
                selected.add(acts[i]);
                lastFinish = acts[i].finish;
            }
        }
        return selected;
    }

    public static void main(String[] args) {
        Activity[] acts = {
            new Activity(1, 1, 4), new Activity(2, 3, 5),
            new Activity(3, 0, 6), new Activity(4, 5, 7),
            new Activity(5, 8, 9), new Activity(6, 5, 9)
        };
        List<Activity> res = selectActivities(acts);
        System.out.println("Maximum Compatible Activities: " + res.size());
        for (Activity a : res) {
            System.out.println("A" + a.id + " [" + a.start + ", " + a.finish + "]");
        }
    }
}`,
      python: `from dataclasses import dataclass
from typing import List

@dataclass
class Activity:
    id: int
    start: int
    finish: int

def select_activities(activities: List[Activity]) -> List[Activity]:
    # Sort activities by finish time ascending
    sorted_acts = sorted(activities, key=lambda a: a.finish)
    
    selected = [sorted_acts[0]]
    last_finish = sorted_acts[0].finish
    
    for act in sorted_acts[1:]:
        if act.start >= last_finish:
            selected.append(act)
            last_finish = act.finish
            
    return selected

if __name__ == '__main__':
    acts = [
        Activity(1, 1, 4), Activity(2, 3, 5),
        Activity(3, 0, 6), Activity(4, 5, 7),
        Activity(5, 8, 9), Activity(6, 5, 9)
    ]
    scheduled = select_activities(acts)
    print(f"Total Selected: {len(scheduled)}")
    for a in scheduled:
        print(f"A{a.id}: [{a.start}, {a.finish}]")`
    }
  },
  {
    id: 'longest-common-subsequence',
    name: 'Longest Common Subsequence (LCS)',
    category: 'Dynamic Programming',
    badge: 'Dynamic Programming',
    tagline: 'Solves the classic sequence alignment problem using a 2D dynamic programming table and backward reconstruction.',
    shortDescription: 'Finds the longest sequence present in both strings in identical relative order using memoized subproblems.',
    introduction: `The Longest Common Subsequence (LCS) problem is a fundamental algorithmic challenge in computer science and computational biology. Given two sequences (strings) S_1 of length m and S_2 of length n, the task is to discover the longest subsequence common to both strings.

A subsequence is derived from a sequence by deleting zero or more elements without changing the order of the remaining elements (unlike substrings, subsequences do not require characters to be consecutive). For example, "ADH" is an LCS of "ABCDGH" and "AEDFHR".

Because the naive recursive brute-force approach has an exponential time complexity of O(2^(m+n)) due to extensively overlapping subproblems, Dynamic Programming stores solutions to subproblems in a 2D matrix of size (m+1) × (n+1), reducing execution time to O(m × n).`,
    workingPrinciple: `The algorithm utilizes a bottom-up Dynamic Programming table DP[0..m][0..n], where DP[i][j] stores the LCS length of prefixes S_1[0..i-1] and S_2[0..j-1]:

1. Base Cases (Row 0 & Col 0):
   DP[0][j] = 0 for all 0 ≤ j ≤ n
   DP[i][0] = 0 for all 0 ≤ i ≤ m
   Reason: An empty string shares 0 common characters with any sequence.

2. State Transition Recurrence:
   For 1 ≤ i ≤ m and 1 ≤ j ≤ n:
   - If S_1[i-1] == S_2[j-1] (Characters Match!):
     DP[i][j] = 1 + DP[i-1][j-1]
     (Add 1 to the diagonal subproblem result)
   - Else (Mismatch):
     DP[i][j] = max(DP[i-1][j], DP[i][j-1])
     (Inherit the maximum from the top or left cell)

3. Backtracking Reconstruction:
   Once the matrix is filled, start from cell (m, n):
   - If S_1[i-1] == S_2[j-1], character is part of LCS! Prepend it to the LCS string and move diagonally to (i-1, j-1).
   - Else if DP[i-1][j] ≥ DP[i][j-1], move up to (i-1, j).
   - Else, move left to (i, j-1).
   - Terminate when i == 0 or j == 0.`,
    algorithmSteps: [
      'Input two strings S1 (length m) and S2 (length n).',
      'Create a 2D array DP of size (m + 1) x (n + 1).',
      'Initialize all cells in the first row (i = 0) and first column (j = 0) to 0.',
      'Iterate row-by-row (i from 1 to m) and column-by-column (j from 1 to n):',
      '  a. If S1[i - 1] == S2[j - 1]:',
      '       DP[i][j] = 1 + DP[i - 1][j - 1]',
      '  b. Else:',
      '       DP[i][j] = max(DP[i - 1][j], DP[i][j - 1])',
      'The value at DP[m][n] represents the maximum LCS length.',
      'Backtrack from (m, n) to (0, 0):',
      '  a. If S1[i - 1] == S2[j - 1]:',
      '       Include S1[i - 1] in LCS, decrement i and j.',
      '  b. Else if DP[i - 1][j] >= DP[i][j - 1]:',
      '       Decrement i (move up).',
      '  c. Else:',
      '       Decrement j (move left).',
      'Reverse the accumulated string to get the final LCS.'
    ],
    pseudocode: `algorithm LongestCommonSubsequence(S1, S2):
    m = length(S1)
    n = length(S2)
    DP = 2D array of size (m + 1) x (n + 1) initialized to 0
    
    // Fill the DP table
    for i = 1 to m:
        for j = 1 to n:
            if S1[i - 1] == S2[j - 1]:
                DP[i][j] = 1 + DP[i - 1][j - 1]
            else:
                DP[i][j] = max(DP[i - 1][j], DP[i][j - 1])
                
    // Backtracking to reconstruct the subsequence
    lcs = ""
    i = m
    j = n
    while i > 0 and j > 0:
        if S1[i - 1] == S2[j - 1]:
            lcs = S1[i - 1] + lcs
            i = i - 1
            j = j - 1
        else if DP[i - 1][j] >= DP[i][j - 1]:
            i = i - 1
        else:
            j = j - 1
            
    return (lcs, DP[m][n])`,
    mathematicalFormulas: [
      {
        name: 'DP Recurrence Relation',
        formula: 'DP[i][j] = \\begin{cases} 0 & \\text{if } i = 0 \\lor j = 0 \\\\ 1 + DP[i-1][j-1] & \\text{if } S_1[i-1] = S_2[j-1] \\\\ \\max(DP[i-1][j], DP[i][j-1]) & \\text{if } S_1[i-1] \\ne S_2[j-1] \\end{cases}',
        description: 'Complete piecewise mathematical recurrence for optimal LCS prefix solutions.'
      },
      {
        name: 'Space Complexity Optimization',
        formula: 'O(\\min(m, n))',
        description: 'Can be achieved if only the LCS length is required (using two rolling rows).'
      }
    ],
    complexity: {
      timeBest: 'O(m × n)',
      timeAverage: 'O(m × n)',
      timeWorst: 'O(m × n)',
      space: 'O(m × n)'
    },
    sampleInputOutput: {
      input: `String 1: "ABCDGH" (length 6)
String 2: "AEDFHR" (length 6)`,
      output: `Completed DP Table Dimensions: 7 x 7
LCS Length: 3
Longest Common Subsequence: "ADH"

Detailed Backtrack Path:
- (6, 6) 'H' matches 'H' -> Add 'H', move to (5, 5)
- (5, 5) 'G' != 'F', Top DP[4][5]=2 == Left DP[5][4]=2 -> Move Up to (4, 5)
- (4, 5) 'D' matches 'D' -> Add 'D', move to (3, 4)
- (3, 4) 'C' != 'E', Left DP[3][3]=1 >= Top DP[2][4]=1 -> Move Left to (3, 3)
- (3, 3) 'C' != 'A', Left DP[3][2]=1 >= Top DP[2][3]=1 -> Move Left to (3, 2)
- (3, 2) 'C' != 'E', Top DP[2][2]=1 >= Left DP[3][1]=1 -> Move Up to (2, 2)
- (2, 2) 'B' != 'E', Top DP[1][2]=1 >= Left DP[2][1]=0 -> Move Up to (1, 2)
- (1, 2) 'A' != 'E', Left DP[1][1]=1 >= Top DP[0][2]=0 -> Move Left to (1, 1)
- (1, 1) 'A' matches 'A' -> Add 'A', move to (0, 0)
Reconstructed Sequence: "ADH"`
    },
    advantages: [
      'Eliminates exponential O(2^(m+n)) recursive branching via dynamic programming memoization.',
      'Guarantees the globally optimal longest common subsequence.',
      'Flexible application across text, DNA sequences, audio fingerprints, and diff utilities.',
      'Simple backward tracing to reconstruct the exact matching string.'
    ],
    disadvantages: [
      'Quadratic O(m × n) memory requirement when reconstructing full paths for very long strings.',
      'Does not distinguish between closely grouped vs widely dispersed subsequence characters.',
      'Can produce multiple equally optimal distinct subsequences if ties exist.'
    ],
    realWorldApplications: [
      'Version Control Systems (Git Diff): Powers the core diff engine comparing text files across commits.',
      'Bioinformatics & Genomics: DNA and protein sequence alignment to detect evolutionary conservation across species.',
      'Plagiarism Detection: Measuring sequence similarity percentages between student submissions and internet documents.',
      'Speech & Audio Recognition: Aligning spoken phoneme sequences against pronunciation dictionaries.'
    ],
    implementations: {
      c: `#include <stdio.h>
#include <string.h>

#define MAX 100

int max(int a, int b) {
    return (a > b) ? a : b;
}

void longestCommonSubsequence(char *s1, char *s2) {
    int m = strlen(s1);
    int n = strlen(s2);
    int dp[MAX][MAX];

    // Build DP table
    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            if (i == 0 || j == 0)
                dp[i][j] = 0;
            else if (s1[i - 1] == s2[j - 1])
                dp[i][j] = 1 + dp[i - 1][j - 1];
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }

    int lcsLen = dp[m][n];
    char lcs[MAX];
    lcs[lcsLen] = '\\0';

    // Backtrack to find LCS
    int i = m, j = n, index = lcsLen - 1;
    while (i > 0 && j > 0) {
        if (s1[i - 1] == s2[j - 1]) {
            lcs[index] = s1[i - 1];
            i--; j--; index--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    printf("LCS Length: %d\\n", lcsLen);
    printf("LCS: %s\\n", lcs);
}

int main() {
    char s1[] = "ABCDGH";
    char s2[] = "AEDFHR";
    longestCommonSubsequence(s1, s2);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

std::pair<std::string, int> lcs(const std::string& s1, const std::string& s2) {
    int m = s1.size();
    int n = s2.size();
    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));

    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    std::string result = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (s1[i - 1] == s2[j - 1]) {
            result += s1[i - 1];
            --i; --j;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            --i;
        } else {
            --j;
        }
    }

    std::reverse(result.begin(), result.end());
    return {result, dp[m][n]};
}

int main() {
    std::string s1 = "ABCDGH";
    std::string s2 = "AEDFHR";
    auto [result, length] = lcs(s1, s2);
    std::cout << "LCS Length: " << length << "\\n";
    std::cout << "LCS String: " << result << "\\n";
    return 0;
}`,
      java: `public class LongestCommonSubsequence {
    public static void findLCS(String s1, String s2) {
        int m = s1.length();
        int n = s2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                sb.append(s1.charAt(i - 1));
                i--; j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }

        String lcs = sb.reverse().toString();
        System.out.println("LCS Length: " + dp[m][n]);
        System.out.println("LCS String: " + lcs);
    }

    public static void main(String[] args) {
        String s1 = "ABCDGH";
        String s2 = "AEDFHR";
        findLCS(s1, s2);
    }
}`,
      python: `def longest_common_subsequence(s1: str, s2: str) -> tuple[str, int]:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # Backtracking
    lcs_chars = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i - 1] == s2[j - 1]:
            lcs_chars.append(s1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] >= dp[i][j - 1]:
            i -= 1
        else:
            j -= 1

    lcs_string = "".join(reversed(lcs_chars))
    return lcs_string, dp[m][n]

if __name__ == '__main__':
    s1 = "ABCDGH"
    s2 = "AEDFHR"
    subsequence, length = longest_common_subsequence(s1, s2)
    print(f"LCS Length: {length}")
    print(f"LCS String: '{subsequence}'")`
    }
  }
];

