/**
 * preparationSyllabus.js
 * Comprehensive placement preparation syllabus for CareerSense.
 *
 * Contains ALL 16 core subjects requested in the placement syllabus specification:
 * 1. Programming Fundamentals
 * 2. Object-Oriented Programming
 * 3. Data Structures
 * 4. Data Structures and Algorithms / DSA
 * 5. Java Programming
 * 6. Python Programming
 * 7. DBMS
 * 8. Operating Systems
 * 9. Computer Networks
 * 10. Design and Analysis of Algorithms
 * 11. Quantitative Aptitude
 * 12. Logical Reasoning
 * 13. Verbal Ability
 * 14. Software Engineering and Testing
 * 15. Web Development and Full-Stack Fundamentals
 * 16. Placement and Interview Preparation
 *
 * Hierarchy: Subject -> Topic -> Subtopic -> Learning Resources, Practice Exercises, Metadata
 */

export const PREPARATION_SYLLABUS = [
  // =========================================================================
  // SUBJECT 1: Programming Fundamentals
  // =========================================================================
  {
    id: 'programming-fundamentals',
    name: 'Programming Fundamentals',
    shortName: 'Prog Fundamentals',
    description: 'Foundational programming concepts: memory, execution models, types, control flow, functions, and complexity.',
    category: 'Computer Science & Coding',
    iconName: 'Terminal',
    topics: [
      {
        id: 'pf-syntax-data',
        name: 'Variables, Types & Operators',
        description: 'Basic computational memory units, data typing, operators, and I/O streams.',
        subtopics: [
          {
            id: 'pf-variables-constants',
            name: 'Variables and Constants',
            description: 'Memory allocation, variable declarations, immutability, scope, and constant identifiers.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Variables and Constants', url: 'https://www.geeksforgeeks.org/variables-in-c/', type: 'tutorial' },
              { title: 'W3Schools: Variables Overview', url: 'https://www.w3schools.com/c/c_variables.php', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Variable Declarations', url: 'https://www.hackerrank.com/challenges/c-tutorial-basic-data-types/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'pf-data-types',
            name: 'Data Types',
            description: 'Primitive types (int, float, char, boolean), ranges, memory sizes, and representation in memory.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['pf-variables-constants'],
            learningResources: [
              { title: 'GeeksforGeeks: Data Types', url: 'https://www.geeksforgeeks.org/data-types-in-c/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Data Types in C/C++', url: 'https://www.hackerrank.com/domains/cpp', platform: 'HackerRank' },
            ],
          },
          {
            id: 'pf-operators-expressions',
            name: 'Operators and Expressions',
            description: 'Arithmetic, logical, relational, bitwise, assignment operators, and precedence rules.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['pf-data-types'],
            learningResources: [
              { title: 'GeeksforGeeks: Operators in Programming', url: 'https://www.geeksforgeeks.org/operators-in-c/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Operators Challenge', url: 'https://www.hackerrank.com/challenges/operators/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'pf-type-conversion',
            name: 'Type Conversion',
            description: 'Implicit type coercion vs explicit type casting, precision loss, and widening vs narrowing.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: ['pf-data-types'],
            learningResources: [
              { title: 'GeeksforGeeks: Type Casting and Conversion', url: 'https://www.geeksforgeeks.org/type-casting-in-c/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Type Conversion Quizzes', url: 'https://www.geeksforgeeks.org/c-type-casting-quiz/', platform: 'Practice' },
            ],
          },
          {
            id: 'pf-input-output',
            name: 'Input and Output',
            description: 'Standard I/O streams (stdin, stdout, stderr), formatted input/output, and buffer handling.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: ['pf-variables-constants'],
            learningResources: [
              { title: 'GeeksforGeeks: Basic Input and Output', url: 'https://www.geeksforgeeks.org/basic-input-and-output-in-c/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Input and Output', url: 'https://www.hackerrank.com/challenges/cpp-input-and-output/problem', platform: 'HackerRank' },
            ],
          },
        ],
      },
      {
        id: 'pf-control-functions',
        name: 'Control Flow & Modularity',
        description: 'Decision branches, loops, functions, and recursion mechanics.',
        subtopics: [
          {
            id: 'pf-conditionals',
            name: 'Conditional Statements',
            description: 'if, if-else, nested conditionals, switch-case, and ternary operator logic.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['pf-operators-expressions'],
            learningResources: [
              { title: 'W3Schools: Decision Making in C', url: 'https://www.w3schools.com/c/c_conditions.php', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Conditional Statements', url: 'https://www.hackerrank.com/challenges/c-tutorial-conditional-if-else/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'pf-loops',
            name: 'Loops',
            description: 'for loops, while loops, do-while loops, break, continue, and nested loop execution.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['pf-conditionals'],
            learningResources: [
              { title: 'GeeksforGeeks: Loops in Programming', url: 'https://www.geeksforgeeks.org/loops-in-c-and-cpp/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: For Loops', url: 'https://www.hackerrank.com/challenges/c-tutorial-for-loop/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'pf-functions-parameters',
            name: 'Functions and Parameters',
            description: 'Function signatures, return types, pass-by-value vs pass-by-reference, scope, and modularity.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['pf-loops'],
            learningResources: [
              { title: 'GeeksforGeeks: Functions in C', url: 'https://www.geeksforgeeks.org/functions-in-c/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Functions', url: 'https://www.hackerrank.com/challenges/c-tutorial-functions/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'pf-recursion',
            name: 'Recursion',
            description: 'Base conditions, recursive call stack, head vs tail recursion, and recurrence relations.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['pf-functions-parameters'],
            learningResources: [
              { title: 'GeeksforGeeks: Introduction to Recursion', url: 'https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 509: Fibonacci Number', url: 'https://leetcode.com/problems/fibonacci-number/', platform: 'LeetCode' },
            ],
          },
        ],
      },
      {
        id: 'pf-debugging-complexity',
        name: 'Arrays, Debugging & Complexity',
        description: 'Sequential data, debugging techniques, and algorithmic complexity fundamentals.',
        subtopics: [
          {
            id: 'pf-arrays-strings',
            name: 'Arrays and Strings',
            description: 'Contiguous memory indexing, string representations, null terminators, and traversal.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['pf-loops'],
            learningResources: [
              { title: 'GeeksforGeeks: Arrays in C', url: 'https://www.geeksforgeeks.org/c-arrays/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Arrays Introduction', url: 'https://www.hackerrank.com/challenges/arrays-introduction/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'pf-basic-debugging',
            name: 'Basic Debugging',
            description: 'Print debugging, breakpoint inspection, common compiler warnings, off-by-one errors, and memory leaks.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['pf-arrays-strings'],
            learningResources: [
              { title: 'GeeksforGeeks: Debugging Techniques', url: 'https://www.geeksforgeeks.org/debugging-techniques-in-c-c/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: C++ Exception Handling', url: 'https://www.hackerrank.com/challenges/c-tutorial-exception-handling/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'pf-complexity-fundamentals',
            name: 'Time and Space Complexity Fundamentals',
            description: 'Step counting, Big-O intuition, space auxiliary footprint, and loop complexity analysis.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['pf-loops'],
            learningResources: [
              { title: 'GeeksforGeeks: Complexity Analysis', url: 'https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Complexity Quizzes', url: 'https://www.geeksforgeeks.org/practice-questions-time-complexity-analysis/', platform: 'Practice' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 2: Object-Oriented Programming
  // =========================================================================
  {
    id: 'object-oriented-programming',
    name: 'Object-Oriented Programming',
    shortName: 'OOP',
    description: 'Object-oriented paradigm: encapsulation, inheritance, polymorphism, abstraction, composition, and exception handling.',
    category: 'Computer Science & Coding',
    iconName: 'Box',
    topics: [
      {
        id: 'oop-core-pillars',
        name: 'Classes, Objects & Core Pillars',
        description: 'The foundation of OOP architecture and the four core principles.',
        subtopics: [
          {
            id: 'oop-classes-objects',
            name: 'Classes and Objects',
            description: 'State and behavior encapsulation, blueprints, instantiation, and object heap lifecycle.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['pf-functions-parameters'],
            learningResources: [
              { title: 'Oracle Java Documentation: Classes and Objects', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html', type: 'documentation' },
              { title: 'GeeksforGeeks: Classes and Objects', url: 'https://www.geeksforgeeks.org/classes-objects-java/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Classes and Objects', url: 'https://www.hackerrank.com/challenges/c-tutorial-class/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'oop-constructors',
            name: 'Constructors',
            description: 'Default, parameterized, copy constructors, constructor overloading, chaining, and object destruction.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['oop-classes-objects'],
            learningResources: [
              { title: 'GeeksforGeeks: Constructors in OOP', url: 'https://www.geeksforgeeks.org/constructors-in-java/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'W3Schools: Constructor Practice', url: 'https://www.w3schools.com/java/java_constructors.asp', platform: 'Practice' },
            ],
          },
          {
            id: 'oop-encapsulation',
            name: 'Encapsulation',
            description: 'Data hiding, getter/setter patterns, invariant protection, and defensive copying.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['oop-classes-objects'],
            learningResources: [
              { title: 'GeeksforGeeks: Encapsulation in Java', url: 'https://www.geeksforgeeks.org/encapsulation-in-java/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'W3Schools: Encapsulation Exercises', url: 'https://www.w3schools.com/java/java_encapsulation.asp', platform: 'Practice' },
            ],
          },
          {
            id: 'oop-inheritance',
            name: 'Inheritance',
            description: 'Single, multilevel, hierarchical inheritance, super keyword, and IS-A relationships.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['oop-classes-objects'],
            learningResources: [
              { title: 'Oracle Java Documentation: Inheritance', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Inheritance II', url: 'https://www.hackerrank.com/challenges/java-inheritance-2/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'oop-polymorphism',
            name: 'Polymorphism',
            description: 'Compile-time vs runtime polymorphism, dynamic method dispatch, and virtual function tables.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['oop-inheritance'],
            learningResources: [
              { title: 'Oracle Docs: Polymorphism', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Method Overriding', url: 'https://www.hackerrank.com/challenges/java-method-overriding/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'oop-abstraction',
            name: 'Abstraction',
            description: 'Hiding implementation details, abstract classes, abstract methods, and public contracts.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['oop-polymorphism'],
            learningResources: [
              { title: 'GeeksforGeeks: Abstraction in OOP', url: 'https://www.geeksforgeeks.org/abstraction-in-java-2/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Abstract Class', url: 'https://www.hackerrank.com/challenges/java-abstract-class/problem', platform: 'HackerRank' },
            ],
          },
        ],
      },
      {
        id: 'oop-advanced-concepts',
        name: 'Advanced OOP Design & Practice',
        description: 'Interfaces, modifiers, relations, exceptions, and practical coding exercises.',
        subtopics: [
          {
            id: 'oop-interfaces',
            name: 'Interfaces',
            description: 'Contracts, multiple inheritance via interfaces, default & static interface methods.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['oop-abstraction'],
            learningResources: [
              { title: 'Oracle Docs: Interfaces', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Interface', url: 'https://www.hackerrank.com/challenges/java-interface/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'oop-overloading-overriding',
            name: 'Method Overloading and Overriding',
            description: 'Signature differences, return type covariance, annotation rules (@Override), and resolution mechanics.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['oop-polymorphism'],
            learningResources: [
              { title: 'GeeksforGeeks: Overloading vs Overriding', url: 'https://www.geeksforgeeks.org/difference-between-method-overloading-and-method-overriding-in-java/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'GeeksforGeeks: Polymorphism Quiz', url: 'https://www.geeksforgeeks.org/java-polymorphism-quiz/', platform: 'Practice' },
            ],
          },
          {
            id: 'oop-access-modifiers',
            name: 'Access Modifiers',
            description: 'public, protected, default (package-private), and private visibility scoping.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: ['oop-encapsulation'],
            learningResources: [
              { title: 'GeeksforGeeks: Access Modifiers', url: 'https://www.geeksforgeeks.org/access-modifiers-java/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Visibility Quizzes', url: 'https://www.geeksforgeeks.org/java-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'oop-static-final',
            name: 'Static and Final Concepts',
            description: 'Class-level members (static), static blocks, final variables, final methods, and immutable classes.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['oop-classes-objects'],
            learningResources: [
              { title: 'GeeksforGeeks: Static Keyword in Java', url: 'https://www.geeksforgeeks.org/static-keyword-java/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Static Initializer Block', url: 'https://www.hackerrank.com/challenges/java-static-initializer-block/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'oop-exception-handling',
            name: 'Exception Handling',
            description: 'try, catch, finally, throw, throws, checked vs unchecked exceptions, and custom exceptions.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['oop-classes-objects'],
            learningResources: [
              { title: 'Oracle Docs: Exceptions', url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Exception Handling', url: 'https://www.hackerrank.com/challenges/java-exception-handling/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'oop-composition-association',
            name: 'Composition and Association',
            description: 'HAS-A vs IS-A relationships, aggregation, strong composition, and dependency injection.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['oop-inheritance'],
            learningResources: [
              { title: 'GeeksforGeeks: Association, Composition and Aggregation', url: 'https://www.geeksforgeeks.org/association-composition-aggregation-java/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Composition Design', url: 'https://www.geeksforgeeks.org/oops-design-patterns-questions/', platform: 'Practice' },
            ],
          },
          {
            id: 'oop-practical-exercises',
            name: 'Practical OOP Coding Exercises',
            description: 'Real-world class design: banking system, library manager, vehicle hierarchy, and parking lot simulation.',
            estimatedTime: '2 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['oop-interfaces', 'oop-composition-association'],
            learningResources: [
              { title: 'GeeksforGeeks: OOP Interview Questions', url: 'https://www.geeksforgeeks.org/oops-interview-questions/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1603: Design Parking System', url: 'https://leetcode.com/problems/design-parking-system/', platform: 'LeetCode' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 3: Data Structures
  // =========================================================================
  {
    id: 'data-structures',
    name: 'Data Structures',
    shortName: 'Data Structures',
    description: 'Understanding and implementing core linear and non-linear memory structures: arrays, lists, trees, heaps, tries, and disjoint sets.',
    category: 'Computer Science & Coding',
    iconName: 'Database',
    topics: [
      {
        id: 'ds-linear',
        name: 'Linear Structures',
        description: 'Sequential memory layouts, pointer chains, LIFO/FIFO buffers, and hash tables.',
        subtopics: [
          {
            id: 'ds-arrays',
            name: 'Arrays',
            description: 'Contiguous allocation, static vs dynamic arrays, memory strides, and multidimensional indexing.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['pf-arrays-strings'],
            learningResources: [
              { title: 'GeeksforGeeks: Array Data Structure Guide', url: 'https://www.geeksforgeeks.org/array-data-structure-guide/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1929: Concatenation of Array', url: 'https://leetcode.com/problems/concatenation-of-array/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'ds-strings',
            name: 'Strings',
            description: 'Character arrays, immutability concepts, string builders, encoding, and string hashing.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['ds-arrays'],
            learningResources: [
              { title: 'GeeksforGeeks: String Data Structure', url: 'https://www.geeksforgeeks.org/string-data-structure/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 125: Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'ds-linked-lists',
            name: 'Linked Lists',
            description: 'Singly, doubly, circular linked lists, pointer manipulation, and dynamic node allocation.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['ds-arrays'],
            learningResources: [
              { title: 'GeeksforGeeks: Linked List Guide', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 206: Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'ds-stacks',
            name: 'Stacks',
            description: 'LIFO structure, push/pop mechanics, array and linked list implementation, and stack overflow.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['ds-arrays'],
            learningResources: [
              { title: 'GeeksforGeeks: Stack Data Structure', url: 'https://www.geeksforgeeks.org/stack-data-structure/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 20: Valid Parentheses', url: 'https://leetcode.com/problems/valid-parentheses/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'ds-queues-circular',
            name: 'Queues and Circular Queues',
            description: 'FIFO buffers, circular queue pointer wraparound, and double-ended queues (deque).',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['ds-stacks'],
            learningResources: [
              { title: 'GeeksforGeeks: Queue Data Structure', url: 'https://www.geeksforgeeks.org/queue-data-structure/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 622: Design Circular Queue', url: 'https://leetcode.com/problems/design-circular-queue/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'ds-hash-tables',
            name: 'Hash Tables and Hashing',
            description: 'Hash functions, bucket arrays, collision resolution (chaining, open addressing), and load factor resizing.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['ds-arrays'],
            learningResources: [
              { title: 'GeeksforGeeks: Hashing Data Structure', url: 'https://www.geeksforgeeks.org/hashing-data-structure/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 706: Design HashMap', url: 'https://leetcode.com/problems/design-hashmap/', platform: 'LeetCode' },
            ],
          },
        ],
      },
      {
        id: 'ds-hierarchical-advanced',
        name: 'Hierarchical & Advanced Structures',
        description: 'Trees, heaps, graph storage, prefix tries, and disjoint sets.',
        subtopics: [
          {
            id: 'ds-trees',
            name: 'Trees',
            description: 'Root, children, leaves, depth, height, binary trees, and level-order traversal structures.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['ds-linked-lists'],
            learningResources: [
              { title: 'GeeksforGeeks: Tree Data Structure', url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 104: Maximum Depth of Binary Tree', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'ds-bst',
            name: 'Binary Search Trees',
            description: 'BST property, search, insertion, deletion, and in-order traversal sorting property.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['ds-trees'],
            learningResources: [
              { title: 'GeeksforGeeks: Binary Search Tree', url: 'https://www.geeksforgeeks.org/binary-search-tree-data-structure/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 700: Search in a Binary Search Tree', url: 'https://leetcode.com/problems/search-in-a-binary-search-tree/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'ds-heaps-pq',
            name: 'Heaps and Priority Queues',
            description: 'Binary heap array representation, min-heap vs max-heap, heapify up/down, and priority queues.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['ds-trees'],
            learningResources: [
              { title: 'GeeksforGeeks: Heap Data Structure', url: 'https://www.geeksforgeeks.org/heap-data-structure/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 703: Kth Largest Element in a Stream', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'ds-graph-representations',
            name: 'Graph Representations',
            description: 'Adjacency matrix, adjacency list, edge list, directed vs undirected representations.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['ds-linked-lists', 'ds-arrays'],
            learningResources: [
              { title: 'GeeksforGeeks: Graph and its Representations', url: 'https://www.geeksforgeeks.org/graph-and-its-representations/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1791: Find Center of Star Graph', url: 'https://leetcode.com/problems/find-center-of-star-graph/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'ds-tries',
            name: 'Tries',
            description: 'Prefix trees, character branching, terminal nodes, prefix searching, and autocomplete design.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['ds-trees'],
            learningResources: [
              { title: 'GeeksforGeeks: Trie Data Structure', url: 'https://www.geeksforgeeks.org/trie-insert-and-search/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 208: Implement Trie (Prefix Tree)', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'ds-dsu',
            name: 'Disjoint Set Union',
            description: 'Union-find structure, disjoint sets, path compression, and union by rank.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['ds-trees'],
            learningResources: [
              { title: 'GeeksforGeeks: Disjoint Set Data Structure', url: 'https://www.geeksforgeeks.org/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 547: Number of Provinces', url: 'https://leetcode.com/problems/number-of-provinces/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'ds-choosing-structure',
            name: 'Choosing the Appropriate Data Structure',
            description: 'Tradeoff comparisons: time vs space, lookup vs insertion performance, cache locality.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['ds-hash-tables', 'ds-heaps-pq'],
            learningResources: [
              { title: 'GeeksforGeeks: How to Choose Data Structures', url: 'https://www.geeksforgeeks.org/how-to-choose-the-right-data-structure-for-your-project/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Data Structure Decision Problems', url: 'https://www.geeksforgeeks.org/data-structures-quizzes/', platform: 'Practice' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 4: Data Structures and Algorithms / DSA
  // =========================================================================
  {
    id: 'dsa',
    name: 'Data Structures and Algorithms / DSA',
    shortName: 'DSA Problem Solving',
    description: 'Algorithmic problem-solving patterns, interview-style coding problems, dynamic programming, and graph algorithms.',
    category: 'Computer Science & Coding',
    iconName: 'Code2',
    topics: [
      {
        id: 'dsa-search-sort-pointers',
        name: 'Searching, Sorting & Pointer Techniques',
        description: 'Array techniques, two pointers, sliding window, and divide-and-conquer searching.',
        subtopics: [
          {
            id: 'dsa-complexity-big-o',
            name: 'Complexity Analysis and Big-O Notation',
            description: 'Worst, average, and best cases, amortized analysis, and space complexity.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Understanding Asymptotic Notation', url: 'https://www.geeksforgeeks.org/types-of-asymptotic-notations-in-complexity-analysis-of-algorithms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'GeeksforGeeks: Practice Time Complexity Analysis', url: 'https://www.geeksforgeeks.org/practice-questions-time-complexity-analysis/', platform: 'Practice' },
            ],
          },
          {
            id: 'dsa-linear-binary-search',
            name: 'Linear Search and Binary Search',
            description: 'Searching sorted spaces, search space reduction, lower bound, upper bound, and binary search on answer.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Beginner',
            prerequisites: ['dsa-complexity-big-o'],
            learningResources: [
              { title: 'GeeksforGeeks: Binary Search', url: 'https://www.geeksforgeeks.org/binary-search/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 704: Binary Search', url: 'https://leetcode.com/problems/binary-search/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-sorting-algorithms',
            name: 'Sorting Algorithms',
            description: 'Merge Sort, Quick Sort, Insertion Sort, Bubble Sort, Counting Sort, and stability.',
            estimatedTime: '2 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['dsa-complexity-big-o'],
            learningResources: [
              { title: 'GeeksforGeeks: Sorting Algorithms Guide', url: 'https://www.geeksforgeeks.org/sorting-algorithms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 912: Sort an Array', url: 'https://leetcode.com/problems/sort-an-array/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-two-pointers',
            name: 'Two Pointers',
            description: 'Opposite direction pointers, slow-fast pointers, pair sums, and partitioning.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['dsa-linear-binary-search'],
            learningResources: [
              { title: 'GeeksforGeeks: Two Pointers Technique', url: 'https://www.geeksforgeeks.org/two-pointers-technique/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 167: Two Sum II - Input Array Is Sorted', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-sliding-window',
            name: 'Sliding Window',
            description: 'Fixed size windows, dynamic expanding/shrinking windows, and frequency table tracking.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['dsa-two-pointers'],
            learningResources: [
              { title: 'GeeksforGeeks: Window Sliding Technique', url: 'https://www.geeksforgeeks.org/window-sliding-technique/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 643: Maximum Average Subarray I', url: 'https://leetcode.com/problems/maximum-average-subarray-i/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-prefix-sums',
            name: 'Prefix Sums',
            description: '1D and 2D prefix arrays, range sum queries in O(1), and subarray sum equals K.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['dsa-complexity-big-o'],
            learningResources: [
              { title: 'GeeksforGeeks: Prefix Sum Array', url: 'https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 303: Range Sum Query - Immutable', url: 'https://leetcode.com/problems/range-sum-query-immutable/', platform: 'LeetCode' },
            ],
          },
        ],
      },
      {
        id: 'dsa-recursion-dp-graphs',
        name: 'Recursion, DP, Graphs & Problem Solving',
        description: 'Advanced problem solving patterns: state space search, dynamic programming, and graph algorithms.',
        subtopics: [
          {
            id: 'dsa-recursion',
            name: 'Recursion',
            description: 'Problem decomposition, call stack depth, recurrence relations, and base cases.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Recursion Practice', url: 'https://www.geeksforgeeks.org/recursion-practice-problems-solutions/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 344: Reverse String', url: 'https://leetcode.com/problems/reverse-string/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-backtracking',
            name: 'Backtracking',
            description: 'State space exploration, pruning dead ends, subsets, permutations, and N-Queens.',
            estimatedTime: '2 hrs',
            difficulty: 'Advanced',
            prerequisites: ['dsa-recursion'],
            learningResources: [
              { title: 'GeeksforGeeks: Backtracking Algorithms', url: 'https://www.geeksforgeeks.org/backtracking-algorithms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 78: Subsets', url: 'https://leetcode.com/problems/subsets/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-greedy-algorithms',
            name: 'Greedy Algorithms',
            description: 'Local optimal choices, activity selection, fractional knapsack, and jump game.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['dsa-sorting-algorithms'],
            learningResources: [
              { title: 'GeeksforGeeks: Greedy Algorithms', url: 'https://www.geeksforgeeks.org/greedy-algorithms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 55: Jump Game', url: 'https://leetcode.com/problems/jump-game/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-divide-and-conquer',
            name: 'Divide and Conquer',
            description: 'Splitting subproblems, combining results, merge sort pattern, and quickselect.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['dsa-recursion'],
            learningResources: [
              { title: 'GeeksforGeeks: Divide and Conquer Algorithm', url: 'https://www.geeksforgeeks.org/divide-and-conquer-algorithm-introduction/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 53: Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-dynamic-programming',
            name: 'Dynamic Programming',
            description: 'Overlapping subproblems, optimal substructure, memoization, tabulation, 1D and 2D DP grids.',
            estimatedTime: '3 hrs',
            difficulty: 'Advanced',
            prerequisites: ['dsa-recursion'],
            learningResources: [
              { title: 'GeeksforGeeks: Dynamic Programming Tutorial', url: 'https://www.geeksforgeeks.org/dynamic-programming/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 70: Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/', platform: 'LeetCode' },
              { title: 'LeetCode 198: House Robber', url: 'https://leetcode.com/problems/house-robber/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-bfs',
            name: 'Breadth-First Search',
            description: 'Queue-based level order traversal, shortest path in unweighted graphs, and connected components.',
            estimatedTime: '2 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['ds-queues-circular'],
            learningResources: [
              { title: 'GeeksforGeeks: Breadth First Search for a Graph', url: 'https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 102: Binary Tree Level Order Traversal', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-dfs',
            name: 'Depth-First Search',
            description: 'Recursive and stack-based traversal, path finding, island counting, and tree properties.',
            estimatedTime: '2 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['dsa-recursion'],
            learningResources: [
              { title: 'GeeksforGeeks: Depth First Search for a Graph', url: 'https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 200: Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-shortest-path',
            name: 'Shortest Path Algorithms',
            description: 'Dijkstra with priority queues, Bellman-Ford for negative edges, and BFS for unweighted graphs.',
            estimatedTime: '2 hrs',
            difficulty: 'Advanced',
            prerequisites: ['dsa-bfs'],
            learningResources: [
              { title: 'GeeksforGeeks: Dijkstra Algorithm', url: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 743: Network Delay Time', url: 'https://leetcode.com/problems/network-delay-time/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-mst',
            name: 'Minimum Spanning Trees',
            description: 'Spanning tree properties, Kruskal algorithm with Disjoint Sets, and Prim algorithm.',
            estimatedTime: '2 hrs',
            difficulty: 'Advanced',
            prerequisites: ['ds-dsu'],
            learningResources: [
              { title: 'GeeksforGeeks: Kruskal Algorithm', url: 'https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1584: Min Cost to Connect All Points', url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-topological-sorting',
            name: 'Topological Sorting',
            description: 'Directed Acyclic Graphs (DAG), Kahn algorithm (in-degree BFS), and DFS with recursion stack.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['dsa-dfs'],
            learningResources: [
              { title: 'GeeksforGeeks: Topological Sorting', url: 'https://www.geeksforgeeks.org/topological-sorting/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 207: Course Schedule', url: 'https://leetcode.com/problems/course-schedule/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-cycle-detection',
            name: 'Graph Cycle Detection',
            description: 'Cycle in undirected graphs (visited array) vs directed graphs (recursion stack/in-degree).',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['dsa-topological-sorting'],
            learningResources: [
              { title: 'GeeksforGeeks: Detect Cycle in a Directed Graph', url: 'https://www.geeksforgeeks.org/detect-cycle-in-a-graph/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 210: Course Schedule II', url: 'https://leetcode.com/problems/course-schedule-ii/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dsa-interview-problems',
            name: 'Interview-Style Coding Problems',
            description: 'Solving top recurring campus placement problems on arrays, strings, trees, and graphs.',
            estimatedTime: '3 hrs',
            difficulty: 'Advanced',
            prerequisites: ['dsa-dynamic-programming', 'dsa-dfs'],
            learningResources: [
              { title: 'LeetCode: Top Interview 150', url: 'https://leetcode.com/studyplan/top-interview-150/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode: Blind 75 Must-Do Coding Problems', url: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions', platform: 'LeetCode' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 5: Java Programming
  // =========================================================================
  {
    id: 'java-programming',
    name: 'Java Programming',
    shortName: 'Java Track',
    description: 'Complete Java placement track: JVM internals, syntax, Collections, multithreading, Streams, and coding interviews.',
    category: 'Programming Languages',
    iconName: 'Coffee',
    topics: [
      {
        id: 'java-core-syntax',
        name: 'Java Fundamentals & Core OOP',
        description: 'Java execution environment, syntax, memory model, and object-oriented implementation.',
        subtopics: [
          {
            id: 'java-setup-structure',
            name: 'Java Setup and Program Structure',
            description: 'JDK installation, main method signature, packages, javac compilation, and java command execution.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'Oracle Java Documentation: Getting Started', url: 'https://docs.oracle.com/javase/tutorial/getStarted/', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Welcome to Java', url: 'https://www.hackerrank.com/challenges/welcome-to-java/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-jvm-jre-jdk',
            name: 'JVM, JRE, and JDK',
            description: 'Bytecode, JIT compilation, ClassLoaders, JVM memory regions (Heap, Stack, Metaspace), and Garbage Collection.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['java-setup-structure'],
            learningResources: [
              { title: 'GeeksforGeeks: JVM Architecture Explained', url: 'https://www.geeksforgeeks.org/jvm-works-jvm-architecture/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: JVM Architecture Quiz', url: 'https://www.geeksforgeeks.org/java-jvm-quiz/', platform: 'Practice' },
            ],
          },
          {
            id: 'java-variables-types',
            name: 'Variables and Data Types',
            description: 'Primitive types in Java, wrapper classes (Integer, Double), autoboxing, and unboxing.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['java-setup-structure'],
            learningResources: [
              { title: 'Oracle Docs: Java Primitive Data Types', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Datatypes', url: 'https://www.hackerrank.com/challenges/java-datatypes/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-operators-control',
            name: 'Operators and Control Flow',
            description: 'Arithmetic/bitwise operators, if-else, switch expressions, and ternary expressions.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['java-variables-types'],
            learningResources: [
              { title: 'Oracle Docs: Operators', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java If-Else', url: 'https://www.hackerrank.com/challenges/java-if-else/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-loops-methods',
            name: 'Loops and Methods',
            description: 'for, enhanced for-each, while loops, method overloading, and return values.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['java-operators-control'],
            learningResources: [
              { title: 'Oracle Docs: Control Flow Statements', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Loops I', url: 'https://www.hackerrank.com/challenges/java-loops-i/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-arrays-strings',
            name: 'Arrays and Strings',
            description: '1D/2D arrays, String pool, String immutability, equals vs ==, and common methods.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['java-loops-methods'],
            learningResources: [
              { title: 'GeeksforGeeks: Strings in Java', url: 'https://www.geeksforgeeks.org/strings-in-java/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Strings Introduction', url: 'https://www.hackerrank.com/challenges/java-strings-introduction/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-classes-objects',
            name: 'Classes and Objects',
            description: 'Instantiating objects with new, reference variables, and heap allocation.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['java-loops-methods'],
            learningResources: [
              { title: 'Oracle Docs: Classes', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Classes and Objects', url: 'https://www.hackerrank.com/domains/java', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-constructors-this',
            name: 'Constructors and this',
            description: 'Constructor chaining, this() invocation, and resolving shadowing.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['java-classes-objects'],
            learningResources: [
              { title: 'Oracle Docs: Using the this Keyword', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/thiskey.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Constructors in Java', url: 'https://www.w3schools.com/java/java_constructors.asp', platform: 'Practice' },
            ],
          },
          {
            id: 'java-inheritance-super',
            name: 'Inheritance and super',
            description: 'extends keyword, calling super(), constructor delegation, and Object class hierarchy.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['java-classes-objects'],
            learningResources: [
              { title: 'Oracle Docs: Using super Keyword', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/super.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Inheritance I', url: 'https://www.hackerrank.com/challenges/java-inheritance-1/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-overloading-overriding',
            name: 'Overloading and Overriding',
            description: 'Compile-time binding vs runtime virtual method invocation, and @Override annotation.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['java-inheritance-super'],
            learningResources: [
              { title: 'GeeksforGeeks: Overriding in Java', url: 'https://www.geeksforgeeks.org/overriding-in-java/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Method Overriding 2', url: 'https://www.hackerrank.com/challenges/java-method-overriding-2-super-keyword/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-abstract-interfaces',
            name: 'Abstract Classes and Interfaces',
            description: 'abstract keyword, implements, default interface methods, static methods, and functional interfaces.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['java-inheritance-super'],
            learningResources: [
              { title: 'Oracle Docs: Abstract Methods and Classes', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Abstract Class', url: 'https://www.hackerrank.com/challenges/java-abstract-class/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-encapsulation-polymorphism',
            name: 'Encapsulation and Polymorphism',
            description: 'Encapsulation best practices, upcasting, downcasting, and instanceof operator.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['java-abstract-interfaces'],
            learningResources: [
              { title: 'Oracle Docs: Polymorphism in Java', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Instanceof Keyword', url: 'https://www.hackerrank.com/challenges/java-instanceof-keyword/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-packages-access',
            name: 'Packages and Access Modifiers',
            description: 'Creating packages, import statements, public/protected/package-private/private scoping.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['java-classes-objects'],
            learningResources: [
              { title: 'Oracle Docs: Creating and Using Packages', url: 'https://docs.oracle.com/javase/tutorial/java/package/packages.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Java Scopes Quiz', url: 'https://www.geeksforgeeks.org/java-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'java-exception-handling',
            name: 'Exception Handling',
            description: 'Throwable hierarchy, try-catch-finally, try-with-resources, AutoCloseable, and custom exceptions.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['java-classes-objects'],
            learningResources: [
              { title: 'Oracle Docs: Handling Exceptions', url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Exception Handling', url: 'https://www.hackerrank.com/challenges/java-exception-handling/problem', platform: 'HackerRank' },
            ],
          },
        ],
      },
      {
        id: 'java-advanced-ecosystem',
        name: 'Collections, Strings, Multithreading & Modern Features',
        description: 'Collections framework, StringBuilder, Generics, Lambdas, and Streams API.',
        subtopics: [
          {
            id: 'java-collections-framework',
            name: 'Collections Framework',
            description: 'Collection interface hierarchy, Iterator, Iterable, equals & hashCode contracts.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['java-classes-objects'],
            learningResources: [
              { title: 'Oracle Docs: Collections Framework Overview', url: 'https://docs.oracle.com/javase/tutorial/collections/', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java List', url: 'https://www.hackerrank.com/challenges/java-list/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-list-set-map-queue',
            name: 'List, Set, Map, and Queue',
            description: 'ArrayList vs LinkedList, HashSet vs TreeSet, HashMap vs TreeMap, PriorityQueue, and ArrayDeque.',
            estimatedTime: '2 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['java-collections-framework'],
            learningResources: [
              { title: 'GeeksforGeeks: Collections in Java', url: 'https://www.geeksforgeeks.org/collections-in-java-2/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Hashset', url: 'https://www.hackerrank.com/challenges/java-hashset/problem', platform: 'HackerRank' },
              { title: 'HackerRank: Java Map', url: 'https://www.hackerrank.com/challenges/phone-book/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-generics',
            name: 'Generics',
            description: 'Type parameters, generic classes and methods, bounded type parameters, and wildcard types (? extends T).',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['java-collections-framework'],
            learningResources: [
              { title: 'Oracle Docs: Generics', url: 'https://docs.oracle.com/javase/tutorial/java/generics/', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Generic Methods', url: 'https://www.hackerrank.com/challenges/java-generics/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-string-buffer-builder',
            name: 'String, StringBuilder, and StringBuffer',
            description: 'Immutability vs mutability, thread-safety in StringBuffer, performance benchmarks in string manipulation.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['java-arrays-strings'],
            learningResources: [
              { title: 'GeeksforGeeks: String vs StringBuilder vs StringBuffer', url: 'https://www.geeksforgeeks.org/string-vs-stringbuilder-vs-stringbuffer-in-java/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 387: First Unique Character in a String', url: 'https://leetcode.com/problems/first-unique-character-in-a-string/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'java-file-handling',
            name: 'File Handling',
            description: 'java.io vs java.nio.file, File, FileReader, BufferedReader, try-with-resources, and serialization.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['java-exception-handling'],
            learningResources: [
              { title: 'GeeksforGeeks: File Handling in Java', url: 'https://www.geeksforgeeks.org/file-handling-in-java/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Java I/O Exercises', url: 'https://www.w3schools.com/java/java_files.asp', platform: 'Practice' },
            ],
          },
          {
            id: 'java-streams-lambdas',
            name: 'Streams and Lambdas',
            description: 'Lambda syntax, functional interfaces (Predicate, Function, Consumer), filter, map, collect, and reduce.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['java-collections-framework'],
            learningResources: [
              { title: 'Oracle Docs: Aggregate Operations (Streams)', url: 'https://docs.oracle.com/javase/tutorial/collections/streams/', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Lambda Expressions', url: 'https://www.hackerrank.com/challenges/java-lambda-expressions/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'java-multithreading',
            name: 'Basic Multithreading',
            description: 'Thread class, Runnable interface, thread lifecycle, synchronized keyword, and thread starvation.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['java-classes-objects'],
            learningResources: [
              { title: 'Oracle Docs: Concurrency', url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1114: Print in Order', url: 'https://leetcode.com/problems/print-in-order/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'java-coding-interview',
            name: 'Java Coding Practice and Interview Questions',
            description: 'Campus interview questions: String manipulations, Collections corner cases, HashMap internals, and custom sorting.',
            estimatedTime: '2 hrs',
            difficulty: 'Advanced',
            prerequisites: ['java-list-set-map-queue', 'java-streams-lambdas'],
            learningResources: [
              { title: 'GeeksforGeeks: Top Java Interview Questions', url: 'https://www.geeksforgeeks.org/java-interview-questions/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Java Sort (Comparator)', url: 'https://www.hackerrank.com/challenges/java-sort/problem', platform: 'HackerRank' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 6: Python Programming
  // =========================================================================
  {
    id: 'python-programming',
    name: 'Python Programming',
    shortName: 'Python Track',
    description: 'Complete Python placement track: syntax, collections, comprehensions, OOP, generators, and interview problem solving.',
    category: 'Programming Languages',
    iconName: 'Code',
    topics: [
      {
        id: 'py-fundamentals-syntax',
        name: 'Python Fundamentals & Built-in Structures',
        description: 'Syntax, dynamic typing, built-in collections, and comprehensions.',
        subtopics: [
          {
            id: 'py-syntax-setup',
            name: 'Python Syntax and Setup',
            description: 'Python interpreter, virtual environments (venv), PEP 8 style guide, and indentation rules.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'Python Docs: An Informal Introduction', url: 'https://docs.python.org/3/tutorial/introduction.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Say Hello, World! With Python', url: 'https://www.hackerrank.com/challenges/py-hello-world/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-variables-types',
            name: 'Variables and Data Types',
            description: 'Dynamic typing, type(x), id(x), reference counters, int, float, str, bool, and NoneType.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['py-syntax-setup'],
            learningResources: [
              { title: 'Python Docs: Data Structures Intro', url: 'https://docs.python.org/3/tutorial/datastructures.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Python Division', url: 'https://www.hackerrank.com/challenges/python-division/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-operators',
            name: 'Operators',
            description: 'Arithmetic, logical (and, or, not), identity (is, is not), and membership (in, not in) operators.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: ['py-variables-types'],
            learningResources: [
              { title: 'W3Schools: Python Operators', url: 'https://www.w3schools.com/python/python_operators.asp', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Arithmetic Operators', url: 'https://www.hackerrank.com/challenges/python-arithmetic-operators/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-conditions-loops',
            name: 'Conditions and Loops',
            description: 'if, elif, else, while, for loops with range(), break, continue, and else clause on loops.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['py-operators'],
            learningResources: [
              { title: 'Python Docs: More Control Flow Tools', url: 'https://docs.python.org/3/tutorial/controlflow.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Loops in Python', url: 'https://www.hackerrank.com/challenges/python-loops/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-functions',
            name: 'Functions',
            description: 'def statement, default arguments, *args, **kwargs, docstrings, and scope (LEGB rule).',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['py-conditions-loops'],
            learningResources: [
              { title: 'Python Docs: Defining Functions', url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Write a function', url: 'https://www.hackerrank.com/challenges/write-a-function/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-lists-tuples',
            name: 'Lists and Tuples',
            description: 'Mutable lists vs immutable tuples, indexing, slicing, append, pop, sort, and unpacking.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['py-functions'],
            learningResources: [
              { title: 'Python Docs: Lists', url: 'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Find the Runner-Up Score!', url: 'https://www.hackerrank.com/challenges/find-second-maximum-number-in-a-list/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-sets-dictionaries',
            name: 'Sets and Dictionaries',
            description: 'Unordered hash sets, set operations (&, |, -), key-value dictionaries, dict methods, and key hashing.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['py-lists-tuples'],
            learningResources: [
              { title: 'Python Docs: Dictionaries and Sets', url: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Finding the percentage', url: 'https://www.hackerrank.com/challenges/finding-the-percentage/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-strings-slicing',
            name: 'Strings and Slicing',
            description: 'String formatting (f-strings), join, split, strip, and slice notation start:stop:step.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['py-lists-tuples'],
            learningResources: [
              { title: 'Python Docs: String Methods', url: 'https://docs.python.org/3/library/stdtypes.html#string-methods', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: String Split and Join', url: 'https://www.hackerrank.com/challenges/python-string-split-and-join/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-comprehensions',
            name: 'Comprehensions',
            description: 'List comprehensions, dictionary comprehensions, set comprehensions, and conditional filtering.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['py-lists-tuples'],
            learningResources: [
              { title: 'Python Docs: List Comprehensions', url: 'https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: List Comprehensions', url: 'https://www.hackerrank.com/challenges/list-comprehensions/problem', platform: 'HackerRank' },
            ],
          },
        ],
      },
      {
        id: 'py-advanced-oop',
        name: 'Advanced Python, OOP & Interview Coding',
        description: 'Modules, files, exceptions, Pythonic OOP, generators, and interview challenges.',
        subtopics: [
          {
            id: 'py-modules-packages',
            name: 'Modules and Packages',
            description: 'import, from ... import, __name__ == "__main__", __init__.py, and sys.path resolution.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['py-functions'],
            learningResources: [
              { title: 'Python Docs: Modules', url: 'https://docs.python.org/3/tutorial/modules.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Python Module Management', url: 'https://www.geeksforgeeks.org/python-modules/', platform: 'Practice' },
            ],
          },
          {
            id: 'py-file-handling',
            name: 'File Handling',
            description: 'open(), context managers (with statement), reading line by line, writing, and CSV module.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['py-functions'],
            learningResources: [
              { title: 'Python Docs: Reading and Writing Files', url: 'https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: File Handling Questions', url: 'https://www.geeksforgeeks.org/file-handling-python/', platform: 'Practice' },
            ],
          },
          {
            id: 'py-exception-handling',
            name: 'Exception Handling',
            description: 'try, except, else, finally, raise, custom exception classes, and built-in exception types.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['py-functions'],
            learningResources: [
              { title: 'Python Docs: Errors and Exceptions', url: 'https://docs.python.org/3/tutorial/errors.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Exceptions in Python', url: 'https://www.hackerrank.com/challenges/exceptions/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-classes-objects',
            name: 'Classes and Objects',
            description: 'class definition, self argument, __init__ constructor, instance attributes vs class attributes.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['py-functions'],
            learningResources: [
              { title: 'Python Docs: Classes', url: 'https://docs.python.org/3/tutorial/classes.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Class 2 - Find the Torsional Angle', url: 'https://www.hackerrank.com/challenges/class-2-find-the-torsional-angle/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-inheritance-polymorphism',
            name: 'Inheritance and Polymorphism',
            description: 'Single and multiple inheritance, super(), Method Resolution Order (MRO), and duck typing.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['py-classes-objects'],
            learningResources: [
              { title: 'GeeksforGeeks: Inheritance in Python', url: 'https://www.geeksforgeeks.org/inheritance-in-python/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Python OOP Challenges', url: 'https://www.geeksforgeeks.org/python-classes-and-objects-quiz/', platform: 'Practice' },
            ],
          },
          {
            id: 'py-iterators-generators',
            name: 'Iterators and Generators',
            description: '__iter__, __next__, yield keyword, generator expressions, and memory-efficient streaming.',
            estimatedTime: '1 hr',
            difficulty: 'Advanced',
            prerequisites: ['py-classes-objects'],
            learningResources: [
              { title: 'Python Docs: Generators', url: 'https://docs.python.org/3/tutorial/classes.html#generators', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Python Generators Exercises', url: 'https://www.geeksforgeeks.org/generators-in-python/', platform: 'Practice' },
            ],
          },
          {
            id: 'py-lambda-functions',
            name: 'Lambda Functions',
            description: 'Anonymous functions, map(), filter(), sorted() with key=lambda, and functools.reduce.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['py-functions'],
            learningResources: [
              { title: 'Python Docs: Lambda Expressions', url: 'https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Map and Lambda Function', url: 'https://www.hackerrank.com/challenges/map-and-lambda-expression/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-common-stdlib',
            name: 'Common Standard-Library Modules',
            description: 'collections (Counter, defaultdict, deque), itertools, math, os, sys, and json modules.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['py-modules-packages'],
            learningResources: [
              { title: 'Python Docs: Brief Tour of Standard Library', url: 'https://docs.python.org/3/tutorial/stdlib.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Collections.Counter()', url: 'https://www.hackerrank.com/challenges/collections-counter/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'py-coding-practice',
            name: 'Coding Practice and Interview Questions',
            description: 'Top campus recruitment questions: anagrams, matrix rotations, custom sorting, and dictionary grouping.',
            estimatedTime: '2 hrs',
            difficulty: 'Advanced',
            prerequisites: ['py-common-stdlib'],
            learningResources: [
              { title: 'GeeksforGeeks: Top Python Interview Questions', url: 'https://www.geeksforgeeks.org/python-interview-questions/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1: Two Sum in Python', url: 'https://leetcode.com/problems/two-sum/', platform: 'LeetCode' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 7: DBMS
  // =========================================================================
  {
    id: 'dbms',
    name: 'DBMS',
    shortName: 'DBMS & SQL',
    description: 'Relational data modeling, ER diagrams, SQL DDL/DML/DQL, normalization, transactions, indexing, and query optimization.',
    category: 'Core Computer Science',
    iconName: 'Server',
    topics: [
      {
        id: 'dbms-foundations',
        name: 'Relational Architecture, ER & Keys',
        description: 'Database architecture, relational schema, ER diagrams, keys, and relational algebra.',
        subtopics: [
          {
            id: 'dbms-fundamentals',
            name: 'Database Fundamentals',
            description: 'DBMS architecture, 3-tier ANSI-SPARC schema architecture, and data independence.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: DBMS Architecture', url: 'https://www.geeksforgeeks.org/dbms-architecture-2-tier-3-tier/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: DBMS Architecture MCQs', url: 'https://www.geeksforgeeks.org/dbms-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-relational-model',
            name: 'Relational Model',
            description: 'Relations, tuples, attributes, domains, and relational model integrity constraints.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['dbms-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: Relational Model Concepts', url: 'https://www.geeksforgeeks.org/relational-model-in-dbms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Relational Model Quizzes', url: 'https://www.geeksforgeeks.org/dbms-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-tables-schemas',
            name: 'Tables, Rows, Columns, and Schemas',
            description: 'Physical schema vs logical schema, table representations, null values, and domain constraints.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: ['dbms-relational-model'],
            learningResources: [
              { title: 'W3Schools: SQL Tables', url: 'https://www.w3schools.com/sql/sql_create_table.asp', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: SQL Schema Design', url: 'https://www.w3schools.com/sql/sql_exercises.asp', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-primary-foreign-keys',
            name: 'Primary Keys and Foreign Keys',
            description: 'Entity integrity constraint, referential integrity constraint, and foreign key cascade actions.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['dbms-tables-schemas'],
            learningResources: [
              { title: 'GeeksforGeeks: Primary and Foreign Key', url: 'https://www.geeksforgeeks.org/difference-between-primary-key-and-foreign-key/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'W3Schools: SQL Foreign Key Exercises', url: 'https://www.w3schools.com/sql/sql_foreignkey.asp', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-candidate-composite-keys',
            name: 'Candidate and Composite Keys',
            description: 'Super keys, candidate keys, minimal super key definition, and multi-attribute composite keys.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['dbms-primary-foreign-keys'],
            learningResources: [
              { title: 'GeeksforGeeks: Types of Keys in Relational Model', url: 'https://www.geeksforgeeks.org/types-of-keys-in-relational-model-candidate-super-primary-alternate-and-foreign-keys/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Keys Identification Quiz', url: 'https://www.geeksforgeeks.org/dbms-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-er-diagrams',
            name: 'ER Diagrams',
            description: 'Entities, weak entity sets, attributes (multivalued, composite), cardinality ratios, and converting ER to tables.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['dbms-relational-model'],
            learningResources: [
              { title: 'GeeksforGeeks: Introduction of ER Model', url: 'https://www.geeksforgeeks.org/introduction-of-er-model/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'GeeksforGeeks: ER Model Interview Questions', url: 'https://www.geeksforgeeks.org/commonly-asked-dbms-interview-questions/', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-relational-algebra',
            name: 'Relational Algebra Basics',
            description: 'Selection (sigma), Projection (pi), Cartesian product, Union, Set difference, and Natural Join.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['dbms-relational-model'],
            learningResources: [
              { title: 'GeeksforGeeks: Relational Algebra in DBMS', url: 'https://www.geeksforgeeks.org/introduction-of-relational-algebra-in-dbms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Relational Algebra Operators Quiz', url: 'https://www.geeksforgeeks.org/dbms-quizzes/', platform: 'Practice' },
            ],
          },
        ],
      },
      {
        id: 'dbms-sql-querying',
        name: 'SQL Querying, Views & Indexing',
        description: 'DDL, DML, DQL commands, joins, subqueries, views, and index structures.',
        subtopics: [
          {
            id: 'dbms-sql-fundamentals',
            name: 'SQL Fundamentals',
            description: 'SQL syntax, case insensitivity, data types in SQL, and SQL execution order.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['dbms-tables-schemas'],
            learningResources: [
              { title: 'W3Schools: SQL Tutorial', url: 'https://www.w3schools.com/sql/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 175: Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dbms-ddl-dml-dql-dcl-tcl',
            name: 'DDL, DML, DQL, DCL, and TCL',
            description: 'CREATE/ALTER/DROP (DDL), INSERT/UPDATE/DELETE (DML), SELECT (DQL), GRANT/REVOKE (DCL), COMMIT/ROLLBACK (TCL).',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['dbms-sql-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: SQL Commands (DDL, DML, DCL, TCL, DQL)', url: 'https://www.geeksforgeeks.org/sql-ddl-dql-dml-dcl-tcl-commands/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Revising the Select Query', url: 'https://www.hackerrank.com/challenges/revising-the-select-query/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'dbms-select-clauses',
            name: 'SELECT, WHERE, ORDER BY, and GROUP BY',
            description: 'Filtering with WHERE, sorting with ORDER BY (ASC/DESC), and grouping with GROUP BY and HAVING.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Beginner',
            prerequisites: ['dbms-ddl-dml-dql-dcl-tcl'],
            learningResources: [
              { title: 'W3Schools: SQL Group By', url: 'https://www.w3schools.com/sql/sql_groupby.asp', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 584: Find Customer Referee', url: 'https://leetcode.com/problems/find-customer-referee/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dbms-aggregate-functions',
            name: 'Aggregate Functions',
            description: 'COUNT, SUM, AVG, MIN, MAX, and handling NULLs inside aggregate computations.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['dbms-select-clauses'],
            learningResources: [
              { title: 'W3Schools: SQL Aggregate Functions', url: 'https://www.w3schools.com/sql/sql_count.asp', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 595: Big Countries', url: 'https://leetcode.com/problems/big-countries/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dbms-joins',
            name: 'Joins',
            description: 'INNER JOIN, LEFT (OUTER) JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, and Self Joins.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['dbms-select-clauses'],
            learningResources: [
              { title: 'W3Schools: SQL Joins', url: 'https://www.w3schools.com/sql/sql_join.asp', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 181: Employees Earning More Than Their Managers', url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dbms-subqueries',
            name: 'Subqueries',
            description: 'Nested subqueries, scalar subqueries, IN, EXISTS, ANY, ALL, and correlated subqueries.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['dbms-joins'],
            learningResources: [
              { title: 'GeeksforGeeks: SQL Subqueries', url: 'https://www.geeksforgeeks.org/sql-subquery/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 183: Customers Who Never Order', url: 'https://leetcode.com/problems/customers-who-never-order/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'dbms-constraints',
            name: 'Constraints',
            description: 'NOT NULL, UNIQUE, CHECK, DEFAULT, PRIMARY KEY, and FOREIGN KEY constraint enforcement.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['dbms-ddl-dml-dql-dcl-tcl'],
            learningResources: [
              { title: 'W3Schools: SQL Constraints', url: 'https://www.w3schools.com/sql/sql_constraints.asp', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: SQL Constraints Quiz', url: 'https://www.w3schools.com/sql/sql_quiz.asp', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-views',
            name: 'Views',
            description: 'Virtual tables, CREATE VIEW, updatable views, security abstraction, and materialized views.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['dbms-select-clauses'],
            learningResources: [
              { title: 'GeeksforGeeks: Views in SQL', url: 'https://www.geeksforgeeks.org/sql-views/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: SQL Views Quiz', url: 'https://www.geeksforgeeks.org/sql-views-quiz/', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-indexing',
            name: 'Indexing',
            description: 'Clustered vs non-clustered indexes, B-Trees, B+ Trees, composite indexes, and index selectivity.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['dbms-select-clauses'],
            learningResources: [
              { title: 'GeeksforGeeks: Indexing in Databases', url: 'https://www.geeksforgeeks.org/indexing-in-databases-set-1/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Database Indexing MCQs', url: 'https://www.geeksforgeeks.org/dbms-quizzes/', platform: 'Practice' },
            ],
          },
        ],
      },
      {
        id: 'dbms-normalization-transactions',
        name: 'Normalization, ACID & Concurrency',
        description: 'Functional dependencies, normal forms, transactions, concurrency, and SQL practice.',
        subtopics: [
          {
            id: 'dbms-functional-dependencies',
            name: 'Functional Dependencies',
            description: 'Definition X -> Y, Armstrong axioms (reflexivity, augmentation, transitivity), and attribute closure.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['dbms-candidate-composite-keys'],
            learningResources: [
              { title: 'GeeksforGeeks: Functional Dependency in DBMS', url: 'https://www.geeksforgeeks.org/functional-dependency-and-attribute-closure/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Attribute Closure Problems', url: 'https://www.geeksforgeeks.org/dbms-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-normalization-forms',
            name: 'Normalization: 1NF, 2NF, 3NF, and BCNF',
            description: 'Modification anomalies, First Normal Form (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency), and BCNF.',
            estimatedTime: '2 hrs',
            difficulty: 'Advanced',
            prerequisites: ['dbms-functional-dependencies'],
            learningResources: [
              { title: 'GeeksforGeeks: Normalization in DBMS', url: 'https://www.geeksforgeeks.org/database-normalization-introduction/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Normal Forms Quiz', url: 'https://www.geeksforgeeks.org/dbms-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-transactions-acid',
            name: 'Transactions and ACID Properties',
            description: 'Atomicity, Consistency, Isolation, Durability, transaction lifecycle states, and commit points.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['dbms-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: ACID Properties in DBMS', url: 'https://www.geeksforgeeks.org/acid-properties-in-dbms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Transactions & ACID MCQs', url: 'https://www.geeksforgeeks.org/dbms-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-concurrency-control',
            name: 'Concurrency Control',
            description: 'Serializability, conflicting operations, 2-Phase Locking (2PL), and timestamp ordering protocol.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['dbms-transactions-acid'],
            learningResources: [
              { title: 'GeeksforGeeks: Concurrency Control Techniques', url: 'https://www.geeksforgeeks.org/concurrency-control-techniques/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Concurrency Protocol Quizzes', url: 'https://www.geeksforgeeks.org/dbms-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-deadlocks',
            name: 'Deadlocks',
            description: 'Deadlock detection with wait-for graphs, deadlock prevention (Wait-Die, Wound-Wait), and victim selection.',
            estimatedTime: '1 hr',
            difficulty: 'Advanced',
            prerequisites: ['dbms-concurrency-control'],
            learningResources: [
              { title: 'GeeksforGeeks: Deadlock in DBMS', url: 'https://www.geeksforgeeks.org/deadlock-in-dbms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Deadlock Questions', url: 'https://www.geeksforgeeks.org/dbms-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-recovery',
            name: 'Recovery',
            description: 'Write-Ahead Logging (WAL), checkpoints, undo/redo log operations, and ARIES recovery algorithm basics.',
            estimatedTime: '1 hr',
            difficulty: 'Advanced',
            prerequisites: ['dbms-transactions-acid'],
            learningResources: [
              { title: 'GeeksforGeeks: Recovery System in DBMS', url: 'https://www.geeksforgeeks.org/recovery-system-in-dbms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Database Recovery MCQs', url: 'https://www.geeksforgeeks.org/dbms-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'dbms-sql-interview-questions',
            name: 'SQL Interview Questions and Query Practice',
            description: 'Nth highest salary query, duplicate record deletion, dense_rank vs rank, and correlated updates.',
            estimatedTime: '2 hrs',
            difficulty: 'Advanced',
            prerequisites: ['dbms-joins', 'dbms-subqueries'],
            learningResources: [
              { title: 'LeetCode SQL 50 Study Plan', url: 'https://leetcode.com/studyplan/top-sql-50/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 176: Second Highest Salary', url: 'https://leetcode.com/problems/second-highest-salary/', platform: 'LeetCode' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 8: Operating Systems
  // =========================================================================
  {
    id: 'operating-systems',
    name: 'Operating Systems',
    shortName: 'Operating Systems',
    description: 'Process management, CPU scheduling, synchronization, deadlocks, memory management, file systems, and Linux.',
    category: 'Core Computer Science',
    iconName: 'Cpu',
    topics: [
      {
        id: 'os-process-cpu',
        name: 'Kernel, Processes & CPU Scheduling',
        description: 'OS kernels, system calls, process state machines, scheduling, and context switching.',
        subtopics: [
          {
            id: 'os-fundamentals',
            name: 'OS Fundamentals',
            description: 'Operating system roles, resource abstraction, protection rings (User mode vs Kernel mode), and dual-mode operation.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Operating System Introduction', url: 'https://www.geeksforgeeks.org/introduction-of-operating-system-set-1/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: OS Fundamentals Quiz', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-kernel-system-calls',
            name: 'Kernel and System Calls',
            description: 'Monolithic vs microkernels, trap instructions, fork(), exec(), wait(), and standard system call interfaces.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['os-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: System Calls in OS', url: 'https://www.geeksforgeeks.org/system-call-in-operating-system/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: System Calls MCQs', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-processes-threads',
            name: 'Processes and Threads',
            description: 'PCB (Process Control Block), user threads vs kernel threads, multi-threading models, and TCB.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['os-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: Difference between Process and Thread', url: 'https://www.geeksforgeeks.org/difference-between-process-and-thread/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Process vs Thread Quiz', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-process-states',
            name: 'Process States',
            description: 'New, Ready, Running, Waiting, Terminated transitions, and Ready queue scheduling.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['os-processes-threads'],
            learningResources: [
              { title: 'GeeksforGeeks: States of a Process in Operating System', url: 'https://www.geeksforgeeks.org/states-of-a-process-in-operating-system/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Process Lifecycle Quiz', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-cpu-scheduling-algos',
            name: 'CPU Scheduling Algorithms',
            description: 'FCFS, SJF (preemptive & non-preemptive), Round Robin, Priority Scheduling, and multi-level feedback queues.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['os-process-states'],
            learningResources: [
              { title: 'GeeksforGeeks: CPU Scheduling in Operating Systems', url: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: CPU Scheduling Calculations', url: 'https://www.geeksforgeeks.org/cpu-scheduling-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-context-switching',
            name: 'Context Switching',
            description: 'CPU register preservation, state reload, overhead metrics, and TLB cache invalidation on context switch.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['os-cpu-scheduling-algos'],
            learningResources: [
              { title: 'GeeksforGeeks: Context Switching in OS', url: 'https://www.geeksforgeeks.org/context-switch-in-operating-system/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Context Switching Questions', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-ipc',
            name: 'Inter-Process Communication',
            description: 'Shared memory vs message passing, anonymous pipes, named pipes (FIFOs), message queues, and sockets.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['os-processes-threads'],
            learningResources: [
              { title: 'GeeksforGeeks: Inter Process Communication (IPC)', url: 'https://www.geeksforgeeks.org/inter-process-communication-ipc/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: IPC Methods Quiz', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
        ],
      },
      {
        id: 'os-sync-memory-files',
        name: 'Synchronization, Memory & Storage',
        description: 'Semaphores, deadlocks, virtual memory, paging, file systems, and Linux commands.',
        subtopics: [
          {
            id: 'os-process-synchronization',
            name: 'Process Synchronization',
            description: 'Critical section problem, mutual exclusion, progress, bounded waiting, Peterson solution, and test-and-set.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['os-processes-threads'],
            learningResources: [
              { title: 'GeeksforGeeks: Process Synchronization in OS', url: 'https://www.geeksforgeeks.org/introduction-of-process-synchronization/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1114: Print in Order', url: 'https://leetcode.com/problems/print-in-order/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'os-mutexes-semaphores',
            name: 'Mutexes and Semaphores',
            description: 'Binary semaphores, counting semaphores, wait()/signal(), mutex locking, priority inversion, and priority inheritance.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['os-process-synchronization'],
            learningResources: [
              { title: 'GeeksforGeeks: Mutex vs Semaphore', url: 'https://www.geeksforgeeks.org/mutex-vs-semaphore/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1115: Print FooBar Alternately', url: 'https://leetcode.com/problems/print-foobar-alternately/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'os-critical-sections',
            name: 'Critical Sections',
            description: 'Classical sync problems: Producer-Consumer (bounded buffer), Readers-Writers, and Dining Philosophers.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['os-mutexes-semaphores'],
            learningResources: [
              { title: 'GeeksforGeeks: Classical Problems of Synchronization', url: 'https://www.geeksforgeeks.org/classical-problems-of-synchronization-with-semaphore-solution/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1116: Print Zero Even Odd', url: 'https://leetcode.com/problems/print-zero-even-odd/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'os-deadlocks-prevention',
            name: 'Deadlocks and Prevention',
            description: 'Coffman four conditions, resource allocation graphs, deadlock prevention, Banker avoidance algorithm, and recovery.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['os-process-synchronization'],
            learningResources: [
              { title: 'GeeksforGeeks: Deadlock in OS', url: 'https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Bankers Algorithm Numerical Questions', url: 'https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system-2/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-memory-management',
            name: 'Memory Management',
            description: 'Logical vs physical address space, MMU address translation, internal/external fragmentation, and contiguous allocation.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['os-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: Memory Management in OS', url: 'https://www.geeksforgeeks.org/memory-management-in-operating-system/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Memory Allocation Quiz', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-paging-segmentation',
            name: 'Paging and Segmentation',
            description: 'Page tables, page frames, Translation Lookaside Buffer (TLB), inverted page tables, and segmentation offsets.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['os-memory-management'],
            learningResources: [
              { title: 'GeeksforGeeks: Paging in Operating System', url: 'https://www.geeksforgeeks.org/paging-in-operating-system/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Paging Calculations Quiz', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-virtual-memory',
            name: 'Virtual Memory',
            description: 'Demand paging, page fault handling routine, swap space, thrashing, and working set model.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['os-paging-segmentation'],
            learningResources: [
              { title: 'GeeksforGeeks: Virtual Memory in OS', url: 'https://www.geeksforgeeks.org/virtual-memory-in-operating-system/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Virtual Memory MCQs', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-page-replacement',
            name: 'Page Replacement Algorithms',
            description: 'FIFO, Belady anomaly, Optimal (OPT), Least Recently Used (LRU), and clock algorithm.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['os-virtual-memory'],
            learningResources: [
              { title: 'GeeksforGeeks: Page Replacement Algorithms', url: 'https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 146: LRU Cache', url: 'https://leetcode.com/problems/lru-cache/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'os-file-systems',
            name: 'File Systems',
            description: 'File allocation (contiguous, linked, indexed), inodes, directory structure, and mounting.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['os-memory-management'],
            learningResources: [
              { title: 'GeeksforGeeks: File Systems in OS', url: 'https://www.geeksforgeeks.org/file-systems-in-operating-system/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: File Systems Quiz', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-disk-scheduling',
            name: 'Disk Scheduling',
            description: 'Seek time, rotational latency, FCFS, SSTF, SCAN (elevator), C-SCAN, and LOOK disk algorithms.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['os-file-systems'],
            learningResources: [
              { title: 'GeeksforGeeks: Disk Scheduling Algorithms', url: 'https://www.geeksforgeeks.org/disk-scheduling-algorithms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Disk Scheduling Calculations', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'os-linux-cli-fundamentals',
            name: 'Linux and Command-Line Fundamentals',
            description: 'Linux directory layout (/etc, /var, /dev), permissions (chmod, chown), grep, find, ps, top, and pipes.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['os-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: Essential Linux Commands', url: 'https://www.geeksforgeeks.org/basic-linux-commands/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'HackerRank: Bash - Let\'s Echo', url: 'https://www.hackerrank.com/challenges/bash-tutorials-lets-echo/problem', platform: 'HackerRank' },
            ],
          },
          {
            id: 'os-interview-questions',
            name: 'OS Interview Questions',
            description: 'Top campus interview questions: thread vs process, deadlock scenarios, context switch costs, and thrashing solutions.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['os-mutexes-semaphores', 'os-page-replacement'],
            learningResources: [
              { title: 'GeeksforGeeks: Top OS Interview Questions', url: 'https://www.geeksforgeeks.org/operating-system-interview-questions/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: OS Comprehensive Mock Test', url: 'https://www.geeksforgeeks.org/operating-systems-quizzes/', platform: 'Practice' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 9: Computer Networks
  // =========================================================================
  {
    id: 'computer-networks',
    name: 'Computer Networks',
    shortName: 'Computer Networks',
    description: 'Layered architectures, IP addressing, transport protocols (TCP/UDP), routing, application protocols, and network security.',
    category: 'Core Computer Science',
    iconName: 'Globe',
    topics: [
      {
        id: 'cn-architectures-transport',
        name: 'Layered Models & Transport Protocols',
        description: 'OSI 7 layers, TCP/IP stack, IP addressing, TCP vs UDP, and flow/congestion control.',
        subtopics: [
          {
            id: 'cn-networking-fundamentals',
            name: 'Networking Fundamentals',
            description: 'LAN, WAN, MAN, client-server vs peer-to-peer, packet switching vs circuit switching, and bandwidth vs latency.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Computer Network Basics', url: 'https://www.geeksforgeeks.org/basics-computer-networking/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Networking Basics Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-network-topologies',
            name: 'Network Topologies',
            description: 'Bus, Star, Ring, Mesh, Hybrid topologies, single points of failure, and cabling costs.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: ['cn-networking-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: Network Topologies', url: 'https://www.geeksforgeeks.org/network-topologies/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Topologies Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-osi-model',
            name: 'OSI Model',
            description: '7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application), PDU encapsulation.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['cn-networking-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: Layers of OSI Model', url: 'https://www.geeksforgeeks.org/layers-of-osi-model/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: OSI Layers Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-tcp-ip-model',
            name: 'TCP/IP Model',
            description: '4 layers (Network Access, Internet, Transport, Application), comparison with OSI model.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['cn-osi-model'],
            learningResources: [
              { title: 'GeeksforGeeks: TCP/IP Model', url: 'https://www.geeksforgeeks.org/tcp-ip-model/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: TCP/IP vs OSI Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-tcp-vs-udp',
            name: 'TCP vs UDP',
            description: 'Connection-oriented vs connectionless, 3-way handshake, 4-way FIN termination, checksums, and reliability trade-offs.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['cn-tcp-ip-model'],
            learningResources: [
              { title: 'GeeksforGeeks: Differences Between TCP and UDP', url: 'https://www.geeksforgeeks.org/differences-between-tcp-and-udp/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Transport Layer Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-ip-addressing',
            name: 'IP Addressing',
            description: 'Classful addressing (A, B, C, D, E), network bits vs host bits, private IP ranges (RFC 1918), and loopback (127.0.0.1).',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['cn-tcp-ip-model'],
            learningResources: [
              { title: 'GeeksforGeeks: IP Addressing Introduction', url: 'https://www.geeksforgeeks.org/ip-addressing-introduction-and-classful-addressing/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: IP Addressing Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-ipv4-ipv6',
            name: 'IPv4 and IPv6',
            description: '32-bit IPv4 exhaustion, 128-bit IPv6 hexadecimal format, dual-stack networks, and header comparison.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['cn-ip-addressing'],
            learningResources: [
              { title: 'GeeksforGeeks: Differences between IPv4 and IPv6', url: 'https://www.geeksforgeeks.org/differences-between-ipv4-and-ipv6/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: IPv6 Header Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-subnetting-basics',
            name: 'Subnetting Basics',
            description: 'CIDR slash notation, subnet masks, calculating number of subnets and usable hosts, broadcast IP calculations.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['cn-ip-addressing'],
            learningResources: [
              { title: 'GeeksforGeeks: Introduction to Subnetting', url: 'https://www.geeksforgeeks.org/introduction-to-subnetting/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Subnetting Numerical Exercises', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
        ],
      },
      {
        id: 'cn-protocols-routing-security',
        name: 'Protocols, Routing & Network Security',
        description: 'ARP, DNS, DHCP, HTTP/HTTPS, routing algorithms, devices, Wi-Fi, and network security.',
        subtopics: [
          {
            id: 'cn-mac-arp',
            name: 'MAC Addresses and ARP',
            description: '48-bit physical MAC addresses, Address Resolution Protocol (ARP), ARP cache table, and RARP.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['cn-ip-addressing'],
            learningResources: [
              { title: 'GeeksforGeeks: How Address Resolution Protocol (ARP) Works', url: 'https://www.geeksforgeeks.org/how-address-resolution-protocol-arp-works/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: ARP Protocol Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-dns',
            name: 'DNS',
            description: 'Domain Name System hierarchical resolution, recursive vs iterative queries, root servers, A, CNAME, MX records.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['cn-tcp-ip-model'],
            learningResources: [
              { title: 'GeeksforGeeks: Domain Name System (DNS)', url: 'https://www.geeksforgeeks.org/domain-name-system-dns-in-application-layer/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: DNS Resolution Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-dhcp',
            name: 'DHCP',
            description: 'Dynamic Host Configuration Protocol DORA process (Discover, Offer, Request, Acknowledge), lease time, and default gateway.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['cn-ip-addressing'],
            learningResources: [
              { title: 'GeeksforGeeks: Dynamic Host Configuration Protocol (DHCP)', url: 'https://www.geeksforgeeks.org/dynamic-host-configuration-protocol-dhcp/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: DHCP DORA Process Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-http-https',
            name: 'HTTP and HTTPS',
            description: 'HTTP request-response cycle, status codes (2xx, 3xx, 4xx, 5xx), TLS/SSL asymmetric handshake, and symmetric session encryption.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['cn-tcp-vs-udp'],
            learningResources: [
              { title: 'MDN Web Docs: An Overview of HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: HTTP Methods and Status Codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-routing-switching',
            name: 'Routing and Switching',
            description: 'Distance Vector (Bellman-Ford, count-to-infinity), Link State (Dijkstra, OSPF), BGP, and VLAN switching.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['cn-subnetting-basics'],
            learningResources: [
              { title: 'GeeksforGeeks: Routing Protocols Overview', url: 'https://www.geeksforgeeks.org/routing-protocols-in-computer-network/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Routing Algorithms Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-network-devices',
            name: 'Network Devices',
            description: 'Hubs (Physical), Switches (Data Link), Routers (Network), Gateways, and modern Layer-7 firewalls.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['cn-osi-model'],
            learningResources: [
              { title: 'GeeksforGeeks: Network Devices', url: 'https://www.geeksforgeeks.org/network-devices-hub-repeater-bridge-switch-router-gateways/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Hardware Devices Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-congestion-control',
            name: 'Congestion Control',
            description: 'TCP Slow Start, Congestion Avoidance (AIMD), Fast Retransmit, and Fast Recovery.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['cn-tcp-vs-udp'],
            learningResources: [
              { title: 'GeeksforGeeks: TCP Congestion Control', url: 'https://www.geeksforgeeks.org/tcp-congestion-control/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Congestion Control Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-flow-control',
            name: 'Flow Control',
            description: 'Stop-and-Wait, Sliding Window protocol, Go-Back-N, and Selective Repeat ARQ.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['cn-tcp-vs-udp'],
            learningResources: [
              { title: 'GeeksforGeeks: Sliding Window Protocol', url: 'https://www.geeksforgeeks.org/sliding-window-protocol-set-1/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Flow Control Calculations', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-common-protocols',
            name: 'Common Network Protocols',
            description: 'FTP, SFTP, SMTP, POP3, IMAP, ICMP (ping/traceroute), and Telnet vs SSH.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['cn-tcp-ip-model'],
            learningResources: [
              { title: 'GeeksforGeeks: Application Layer Protocols', url: 'https://www.geeksforgeeks.org/protocols-in-application-layer/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Network Protocols Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-ethernet-wifi',
            name: 'Ethernet and Wi-Fi',
            description: 'IEEE 802.3 (CSMA/CD on Ethernet) vs IEEE 802.11 (CSMA/CA on wireless Wi-Fi), and collision avoidance.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['cn-network-devices'],
            learningResources: [
              { title: 'GeeksforGeeks: CSMA/CD vs CSMA/CA', url: 'https://www.geeksforgeeks.org/difference-between-csmacd-and-csmaca/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Wireless Standards Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-security-fundamentals',
            name: 'Network Security Fundamentals',
            description: 'Symmetric vs asymmetric encryption, RSA basics, digital certificates, firewalls, and DDoS mitigation.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['cn-http-https'],
            learningResources: [
              { title: 'GeeksforGeeks: Cryptography and Network Security', url: 'https://www.geeksforgeeks.org/cryptography-and-network-security-introduction/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Network Security Quiz', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
          {
            id: 'cn-interview-questions',
            name: 'CN Interview Questions',
            description: 'Top placement questions: What happens when you type google.com into browser, TCP 3-way handshake, and IP vs MAC.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['cn-http-https', 'cn-dns', 'cn-tcp-vs-udp'],
            learningResources: [
              { title: 'GeeksforGeeks: Top Computer Network Interview Questions', url: 'https://www.geeksforgeeks.org/computer-network-interview-questions/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Comprehensive CN Placement Test', url: 'https://www.geeksforgeeks.org/computer-network-quizzes/', platform: 'Practice' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 10: Design and Analysis of Algorithms
  // =========================================================================
  {
    id: 'design-and-analysis-of-algorithms',
    name: 'Design and Analysis of Algorithms',
    shortName: 'DAA',
    description: 'Formal algorithm design, proofs of correctness, asymptotic bounds, recurrence relations, Master theorem, and optimization.',
    category: 'Computer Science & Coding',
    iconName: 'GitBranch',
    topics: [
      {
        id: 'daa-analysis-recurrences',
        name: 'Complexity, Recurrences & Divide-and-Conquer',
        description: 'Asymptotic proofs, Master theorem, recurrence trees, and divide-and-conquer analysis.',
        subtopics: [
          {
            id: 'daa-algorithm-analysis',
            name: 'Algorithm Analysis',
            description: 'Framework for analyzing running time, RAM model of computation, and best/worst/average case bounds.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['pf-complexity-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: Design and Analysis of Algorithms Tutorial', url: 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Algorithm Analysis Questions', url: 'https://www.geeksforgeeks.org/algorithms-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'daa-time-space-complexity',
            name: 'Time and Space Complexity',
            description: 'Formal definitions of Big-O, Big-Omega, Big-Theta, Little-o, and Little-omega asymptotic bounds.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['daa-algorithm-analysis'],
            learningResources: [
              { title: 'GeeksforGeeks: Asymptotic Notations and Properties', url: 'https://www.geeksforgeeks.org/asymptotic-notation-and-analysis-based-on-input-size-of-algorithms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Asymptotic Properties Quiz', url: 'https://www.geeksforgeeks.org/algorithms-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'daa-asymptotic-notation',
            name: 'Asymptotic Notation',
            description: 'Order of growth comparisons: O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!).',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['daa-time-space-complexity'],
            learningResources: [
              { title: 'GeeksforGeeks: Order of Growth in Complexity', url: 'https://www.geeksforgeeks.org/analysis-of-algorithms-set-4-analysis-of-loops/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Order of Growth Ranking', url: 'https://www.geeksforgeeks.org/algorithms-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'daa-recurrence-relations',
            name: 'Recurrence Relations',
            description: 'Substitution method, iteration method, and recursion tree method for solving recurrences.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['daa-time-space-complexity'],
            learningResources: [
              { title: 'GeeksforGeeks: How to Solve Recurrence Relations', url: 'https://www.geeksforgeeks.org/recurrence-relations/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Recurrence Tree Exercises', url: 'https://www.geeksforgeeks.org/algorithms-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'daa-master-theorem',
            name: 'Master Theorem',
            description: 'Master theorem cases for divide-and-conquer recurrences: T(n) = aT(n/b) + f(n) and its boundary exceptions.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['daa-recurrence-relations'],
            learningResources: [
              { title: 'GeeksforGeeks: Master Theorem for Divide and Conquer', url: 'https://www.geeksforgeeks.org/master-theorem-for-divide-and-conquer-recurrences/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Master Theorem Quiz', url: 'https://www.geeksforgeeks.org/algorithms-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'daa-divide-and-conquer',
            name: 'Divide and Conquer',
            description: 'Design paradigm: Merge Sort, Strassen Matrix Multiplication, and Closest Pair of Points proofs.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['daa-master-theorem'],
            learningResources: [
              { title: 'GeeksforGeeks: Divide and Conquer Algorithms', url: 'https://www.geeksforgeeks.org/divide-and-conquer-algorithm-introduction/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 912: Sort an Array (Divide and Conquer)', url: 'https://leetcode.com/problems/sort-an-array/', platform: 'LeetCode' },
            ],
          },
        ],
      },
      {
        id: 'daa-paradigms-advanced',
        name: 'Greedy, Dynamic Programming & Graph Design',
        description: 'Greedy choice proofs, DP characterization, knapsack variants, and graph optimization algorithms.',
        subtopics: [
          {
            id: 'daa-greedy-method',
            name: 'Greedy Method',
            description: 'Optimal substructure, greedy choice property, and matroid theory proof basics.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['daa-algorithm-analysis'],
            learningResources: [
              { title: 'GeeksforGeeks: Greedy Algorithms Explained', url: 'https://www.geeksforgeeks.org/greedy-algorithms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 455: Assign Cookies', url: 'https://leetcode.com/problems/assign-cookies/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-dynamic-programming',
            name: 'Dynamic Programming',
            description: 'Principle of optimality, Bellman equations, state transition tables, and DAG longest path framing.',
            estimatedTime: '2 hrs',
            difficulty: 'Advanced',
            prerequisites: ['daa-recurrence-relations'],
            learningResources: [
              { title: 'GeeksforGeeks: Dynamic Programming Paradigm', url: 'https://www.geeksforgeeks.org/dynamic-programming/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 300: Longest Increasing Subsequence', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-knapsack-problems',
            name: 'Knapsack Problems',
            description: 'Fractional Knapsack (Greedy O(n log n)) vs 0/1 Knapsack (Dynamic Programming O(n*W)) proof comparison.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['daa-greedy-method', 'daa-dynamic-programming'],
            learningResources: [
              { title: 'GeeksforGeeks: 0-1 Knapsack Problem', url: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 416: Partition Equal Subset Sum', url: 'https://leetcode.com/problems/partition-equal-subset-sum/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-job-sequencing',
            name: 'Job Sequencing',
            description: 'Job sequencing with deadlines, profit maximization, and union-find optimization.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['daa-greedy-method'],
            learningResources: [
              { title: 'GeeksforGeeks: Job Sequencing Problem', url: 'https://www.geeksforgeeks.org/job-sequencing-problem/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Job Sequencing Coding Challenge', url: 'https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1', platform: 'Practice' },
            ],
          },
          {
            id: 'daa-graph-traversal',
            name: 'Graph Traversal',
            description: 'BFS and DFS classification of edges (tree, back, forward, cross edges) and articulation points.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['ds-graph-representations'],
            learningResources: [
              { title: 'GeeksforGeeks: Graph Edge Classification', url: 'https://www.geeksforgeeks.org/tree-back-edge-and-cross-edges-in-dfs-of-graph/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 133: Clone Graph', url: 'https://leetcode.com/problems/clone-graph/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-mst',
            name: 'Minimum Spanning Trees',
            description: 'Cut property, cycle property, Kruskal analysis with DSU, and Prim algorithm with Fibonacci heap.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['daa-greedy-method'],
            learningResources: [
              { title: 'GeeksforGeeks: Prim Algorithm for MST', url: 'https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1584: Min Cost to Connect Points', url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-dijkstra',
            name: 'Dijkstra\'s Algorithm',
            description: 'Single-source shortest path, non-negative weight proof, and min-priority queue complexity analysis.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['daa-greedy-method'],
            learningResources: [
              { title: 'GeeksforGeeks: Dijkstra Algorithm Complexity', url: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 743: Network Delay Time', url: 'https://leetcode.com/problems/network-delay-time/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-bellman-ford',
            name: 'Bellman-Ford Algorithm',
            description: 'Dynamic programming formulation, relaxing edges V-1 times, and negative weight cycle detection.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['daa-dijkstra'],
            learningResources: [
              { title: 'GeeksforGeeks: Bellman-Ford Algorithm', url: 'https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 787: Cheapest Flights Within K Stops', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-floyd-warshall',
            name: 'Floyd-Warshall Algorithm',
            description: 'All-pairs shortest path, intermediate vertex dynamic programming, and O(V^3) matrix updates.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['daa-bellman-ford'],
            learningResources: [
              { title: 'GeeksforGeeks: Floyd Warshall Algorithm', url: 'https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1334: Find the City With the Smallest Number of Neighbors at a Threshold Distance', url: 'https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-union-find',
            name: 'Union-Find',
            description: 'Inverse Ackermann function alpha(n) complexity, path compression, and rank balancing proofs.',
            estimatedTime: '1 hr',
            difficulty: 'Advanced',
            prerequisites: ['ds-dsu'],
            learningResources: [
              { title: 'GeeksforGeeks: Disjoint Set Union Analysis', url: 'https://www.geeksforgeeks.org/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 684: Redundant Connection', url: 'https://leetcode.com/problems/redundant-connection/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-topological-sorting',
            name: 'Topological Sorting',
            description: 'Proof that a directed graph has a topological sort if and only if it is acyclic (DAG).',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['daa-graph-traversal'],
            learningResources: [
              { title: 'GeeksforGeeks: Topological Sorting in DAA', url: 'https://www.geeksforgeeks.org/topological-sorting/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 207: Course Schedule', url: 'https://leetcode.com/problems/course-schedule/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-articulation-points-bridges',
            name: 'Articulation Points and Bridges',
            description: 'Tarjan discovery time and low-link values algorithm for finding critical vertices and bridges in O(V+E).',
            estimatedTime: '2 hrs',
            difficulty: 'Advanced',
            prerequisites: ['daa-graph-traversal'],
            learningResources: [
              { title: 'GeeksforGeeks: Articulation Points in a Graph', url: 'https://www.geeksforgeeks.org/articulation-points-or-cut-vertices-in-a-graph/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1192: Critical Connections in a Network', url: 'https://leetcode.com/problems/critical-connections-in-a-network/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-backtracking',
            name: 'Backtracking',
            description: 'State space tree generation, bounding functions, Hamiltonian cycle, and sum of subsets.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['daa-algorithm-analysis'],
            learningResources: [
              { title: 'GeeksforGeeks: Backtracking Paradigm', url: 'https://www.geeksforgeeks.org/backtracking-algorithms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 51: N-Queens', url: 'https://leetcode.com/problems/n-queens/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'daa-branch-and-bound',
            name: 'Branch and Bound',
            description: 'State space search for combinatorial optimization, pruning by upper and lower cost bounds, 0/1 knapsack.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['daa-backtracking'],
            learningResources: [
              { title: 'GeeksforGeeks: Branch and Bound Introduction', url: 'https://www.geeksforgeeks.org/branch-and-bound-algorithm/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Branch and Bound Quizzes', url: 'https://www.geeksforgeeks.org/algorithms-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'daa-correctness-comparisons',
            name: 'Algorithm Correctness and Complexity Comparisons',
            description: 'Loop invariants, induction proofs, P vs NP concepts, NP-complete reductions, and polynomial time verification.',
            estimatedTime: '2 hrs',
            difficulty: 'Advanced',
            prerequisites: ['daa-algorithm-analysis'],
            learningResources: [
              { title: 'GeeksforGeeks: NP-Completeness Overview', url: 'https://www.geeksforgeeks.org/np-completeness-set-1/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: P vs NP Complexity Questions', url: 'https://www.geeksforgeeks.org/algorithms-gq/', platform: 'Practice' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 11: Quantitative Aptitude
  // =========================================================================
  {
    id: 'quantitative-aptitude',
    name: 'Quantitative Aptitude',
    shortName: 'Quant Aptitude',
    description: 'Arithmetic, numerical reasoning, business calculations, combinatorics, and data interpretation for placement tests.',
    category: 'Aptitude & Screening',
    iconName: 'Percent',
    topics: [
      {
        id: 'qa-arithmetic-fundamentals',
        name: 'Numbers, Ratios & Percentages',
        description: 'Number theory, fractions, percentages, ratios, and averages.',
        subtopics: [
          {
            id: 'qa-number-systems',
            name: 'Number Systems',
            description: 'Classification of numbers, prime numbers, unit digits, and power cycles.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Number System Aptitude', url: 'https://www.geeksforgeeks.org/number-system/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Numbers Aptitude', url: 'https://www.indiabix.com/aptitude/numbers/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-divisibility-remainders',
            name: 'Divisibility and Remainders',
            description: 'Divisibility tests (2 through 13), remainder theorem, and Euler totient theorem basics.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['qa-number-systems'],
            learningResources: [
              { title: 'GeeksforGeeks: Divisibility Rules', url: 'https://www.geeksforgeeks.org/divisibility-rules/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Divisibility Problems', url: 'https://www.indiabix.com/aptitude/numbers/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-hcf-lcm',
            name: 'HCF and LCM',
            description: 'Prime factorization method, division method, relationship Product = HCF * LCM, and bells ringing problems.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['qa-number-systems'],
            learningResources: [
              { title: 'GeeksforGeeks: HCF and LCM', url: 'https://www.geeksforgeeks.org/hcf-and-lcm/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: H.C.F and L.C.M Questions', url: 'https://www.indiabix.com/aptitude/hcf-and-lcm/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-fractions-decimals',
            name: 'Fractions and Decimals',
            description: 'Recurring decimals to fractions, decimal arithmetic, comparing fractions (cross multiplication).',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['qa-number-systems'],
            learningResources: [
              { title: 'IndiaBIX: Decimal Fraction', url: 'https://www.indiabix.com/aptitude/decimal-fraction/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Decimal Fraction Problems', url: 'https://www.indiabix.com/aptitude/decimal-fraction/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-percentages',
            name: 'Percentages',
            description: 'Percentage base, fraction-percentage conversion, successive percentage change, and population growth.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['qa-fractions-decimals'],
            learningResources: [
              { title: 'GeeksforGeeks: Percentage Concepts', url: 'https://www.geeksforgeeks.org/percentage-aptitude-questions-and-answers/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Percentage Questions', url: 'https://www.indiabix.com/aptitude/percentage/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-ratios-proportions',
            name: 'Ratios and Proportions',
            description: 'Direct and inverse proportions, compound ratios, third and mean proportions, and coin sharing problems.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['qa-percentages'],
            learningResources: [
              { title: 'GeeksforGeeks: Ratio and Proportion', url: 'https://www.geeksforgeeks.org/ratio-and-proportion-aptitude-questions-and-answers/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Ratio and Proportion', url: 'https://www.indiabix.com/aptitude/ratio-and-proportion/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-averages',
            name: 'Averages',
            description: 'Arithmetic mean, weighted average, inclusion/exclusion changes, and cricket batting average problems.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['qa-ratios-proportions'],
            learningResources: [
              { title: 'GeeksforGeeks: Averages Aptitude', url: 'https://www.geeksforgeeks.org/averages-aptitude-questions-and-answers/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Average Questions', url: 'https://www.indiabix.com/aptitude/averages/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-mixtures-alligation',
            name: 'Mixtures and Alligation',
            description: 'Rule of alligation, mean price, mixing two qualities, and repeated dilution of liquids.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['qa-averages'],
            learningResources: [
              { title: 'GeeksforGeeks: Alligation or Mixture', url: 'https://www.geeksforgeeks.org/alligation-or-mixture-aptitude-questions-and-answers/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Alligation or Mixture', url: 'https://www.indiabix.com/aptitude/alligation-or-mixture/', platform: 'IndiaBIX' },
            ],
          },
        ],
      },
      {
        id: 'qa-commercial-time-combinatorics',
        name: 'Commercial Math, Time & Probability',
        description: 'Profit/loss, interest, time & work, speed & distance, combinatorics, and data interpretation.',
        subtopics: [
          {
            id: 'qa-profit-loss-discount',
            name: 'Profit, Loss, and Discount',
            description: 'Cost price, selling price, marked price, trade discount, false balance weights, and partnership shares.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['qa-percentages'],
            learningResources: [
              { title: 'GeeksforGeeks: Profit and Loss Formulas', url: 'https://www.geeksforgeeks.org/profit-and-loss-aptitude-questions-and-answers/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Profit and Loss', url: 'https://www.indiabix.com/aptitude/profit-and-loss/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-simple-compound-interest',
            name: 'Simple and Compound Interest',
            description: 'Principal, rate, time, SI formula, annual/half-yearly compounding, and difference between CI and SI.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['qa-percentages'],
            learningResources: [
              { title: 'GeeksforGeeks: Simple and Compound Interest', url: 'https://www.geeksforgeeks.org/compound-interest/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Simple Interest', url: 'https://www.indiabix.com/aptitude/simple-interest/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-time-work',
            name: 'Time and Work',
            description: 'Unitary rate method, efficiency ratio, alternate days, and wages distribution.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['qa-ratios-proportions'],
            learningResources: [
              { title: 'GeeksforGeeks: Time and Work', url: 'https://www.geeksforgeeks.org/time-and-work-aptitude-questions-and-answers/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Time and Work', url: 'https://www.indiabix.com/aptitude/time-and-work/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-pipes-cisterns',
            name: 'Pipes and Cisterns',
            description: 'Inlet pipes (positive work), outlet/leakage pipes (negative work), and alternating fill/empty cycles.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['qa-time-work'],
            learningResources: [
              { title: 'GeeksforGeeks: Pipes and Cisterns', url: 'https://www.geeksforgeeks.org/pipes-and-cisterns-aptitude-questions-and-answers/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Pipes and Cistern', url: 'https://www.indiabix.com/aptitude/pipes-and-cistern/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-time-speed-distance',
            name: 'Time, Speed, and Distance',
            description: 'Average speed formula, proportional relationships (distance constant vs time constant), and race tracks.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['qa-ratios-proportions'],
            learningResources: [
              { title: 'GeeksforGeeks: Time, Speed and Distance', url: 'https://www.geeksforgeeks.org/time-speed-and-distance-aptitude-questions-and-answers/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Time and Distance', url: 'https://www.indiabix.com/aptitude/time-and-distance/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-trains-boats',
            name: 'Trains and Boats',
            description: 'Relative speed of trains crossing poles/platforms/trains, upstream/downstream water speed in boats.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['qa-time-speed-distance'],
            learningResources: [
              { title: 'IndiaBIX: Problems on Trains', url: 'https://www.indiabix.com/aptitude/problems-on-trains/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Boats and Streams Questions', url: 'https://www.indiabix.com/aptitude/boats-and-streams/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-permutations-combinations',
            name: 'Permutations and Combinations',
            description: 'Counting principles, factorials, arrangements (nPr), selections (nCr), circular permutations, and anagrams.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Permutations and Combinations', url: 'https://www.geeksforgeeks.org/permutations-and-combinations/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Permutation and Combination', url: 'https://www.indiabix.com/aptitude/permutation-and-combination/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-probability',
            name: 'Probability',
            description: 'Sample space, events, coins, dice, cards, conditional probability P(A|B), and independent events.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['qa-permutations-combinations'],
            learningResources: [
              { title: 'Khan Academy: Probability Basics', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Probability Questions', url: 'https://www.indiabix.com/aptitude/probability/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-data-interpretation',
            name: 'Data Interpretation',
            description: 'Bar charts, pie charts, line graphs, data tables, and rapid ratio/percentage extraction.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['qa-percentages', 'qa-ratios-proportions'],
            learningResources: [
              { title: 'IndiaBIX: Data Interpretation', url: 'https://www.indiabix.com/data-interpretation/table-charts/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Bar Charts Practice', url: 'https://www.indiabix.com/data-interpretation/bar-charts/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-ages',
            name: 'Ages',
            description: 'Linear equations for ratio of ages past, present, and future.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['qa-ratios-proportions'],
            learningResources: [
              { title: 'IndiaBIX: Problems on Ages', url: 'https://www.indiabix.com/aptitude/problems-on-ages/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Ages Questions', url: 'https://www.indiabix.com/aptitude/problems-on-ages/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'qa-calendars-clocks',
            name: 'Calendars and Clocks',
            description: 'Odd days, leap years, finding day of a date, angle between hour and minute hands, and clock gains/losses.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Clocks and Calendars Aptitude', url: 'https://www.geeksforgeeks.org/clocks-aptitude-questions-and-answers/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Clock Questions', url: 'https://www.indiabix.com/aptitude/clock/', platform: 'IndiaBIX' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 12: Logical Reasoning
  // =========================================================================
  {
    id: 'logical-reasoning',
    name: 'Logical Reasoning',
    shortName: 'Logical Reasoning',
    description: 'Analytical deductions, series, coding, blood relations, directions, seating arrangements, syllogisms, and puzzles.',
    category: 'Aptitude & Screening',
    iconName: 'Brain',
    topics: [
      {
        id: 'lr-analytical-deduction',
        name: 'Series, Coding & Relationships',
        description: 'Sequences, ciphers, analogies, blood relations, and orientation.',
        subtopics: [
          {
            id: 'lr-number-series',
            name: 'Number Series',
            description: 'Arithmetic progressions, geometric progressions, alternating differences, squares, and cubes.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Number Series Reasoning', url: 'https://www.geeksforgeeks.org/number-series-reasoning/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Number Series', url: 'https://www.indiabix.com/logical-reasoning/number-series/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-letter-series',
            name: 'Letter Series',
            description: 'Alphabet positions (A=1 to Z=26), reverse positions (EJOTY rule), and pattern shifting.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'IndiaBIX: Letter and Symbol Series', url: 'https://www.indiabix.com/logical-reasoning/letter-and-symbol-series/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Letter Series Practice', url: 'https://www.indiabix.com/logical-reasoning/letter-and-symbol-series/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-analogies',
            name: 'Analogies',
            description: 'Word pairs, numerical relationships, functional analogies, and semantic associations.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'IndiaBIX: Analogies Reasoning', url: 'https://www.indiabix.com/logical-reasoning/analogies/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Analogies Practice Questions', url: 'https://www.indiabix.com/logical-reasoning/analogies/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-coding-decoding',
            name: 'Coding and Decoding',
            description: 'Letter shifting (+3, -2), matrix coding, substitution ciphers, and conditional code mapping.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['lr-letter-series'],
            learningResources: [
              { title: 'GeeksforGeeks: Coding and Decoding', url: 'https://www.geeksforgeeks.org/coding-decoding-reasoning/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Coding and Decoding Tests', url: 'https://www.indiabix.com/verbal-reasoning/coding-and-decoding/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-blood-relations',
            name: 'Blood Relations',
            description: 'Family tree diagrams, generational hierarchy, maternal/paternal branches, and coded blood relation equations.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Blood Relations Reasoning', url: 'https://www.geeksforgeeks.org/blood-relations-reasoning/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Blood Relation Test', url: 'https://www.indiabix.com/verbal-reasoning/blood-relation-test/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-direction-sense',
            name: 'Direction Sense',
            description: '8 cardinal points, shadow movements at sunrise/sunset, turns, and Pythagoras theorem for shortest path.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Direction Sense Test', url: 'https://www.geeksforgeeks.org/direction-sense-test-reasoning/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Direction Sense Test', url: 'https://www.indiabix.com/verbal-reasoning/direction-sense-test/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-ranking-ordering',
            name: 'Ranking and Ordering',
            description: 'Position from left/right, total students = (Left + Right - 1), interchanging positions, and ascending/descending height ranks.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Order and Ranking', url: 'https://www.geeksforgeeks.org/order-and-ranking-reasoning/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Ranking Tests', url: 'https://www.indiabix.com/verbal-reasoning/', platform: 'IndiaBIX' },
            ],
          },
        ],
      },
      {
        id: 'lr-puzzles-syllogisms',
        name: 'Seating Arrangements, Puzzles & Syllogisms',
        description: 'Complex constraint puzzles, seating arrangements, syllogisms, and critical deduction.',
        subtopics: [
          {
            id: 'lr-seating-arrangements',
            name: 'Seating Arrangements',
            description: 'Linear arrangements (facing north/south), circular tables (facing inside/outside), parallel rows, and multi-variable constraints.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['lr-ranking-ordering'],
            learningResources: [
              { title: 'GeeksforGeeks: Seating Arrangement Reasoning', url: 'https://www.geeksforgeeks.org/seating-arrangement-reasoning/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Seating Arrangement', url: 'https://www.indiabix.com/logical-reasoning/seating-arrangement/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-puzzles',
            name: 'Puzzles',
            description: 'Floor puzzles, box stacking puzzles, scheduling days/months, and multi-attribute grid matching.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['lr-seating-arrangements'],
            learningResources: [
              { title: 'IndiaBIX: Puzzles and Logical Problems', url: 'https://www.indiabix.com/logical-reasoning/logical-problems/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Logical Problems Practice', url: 'https://www.indiabix.com/logical-reasoning/logical-problems/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-syllogisms',
            name: 'Syllogisms',
            description: 'Premises, conclusions, Venn diagrams, "All", "Some", "No", and "Some not", and possibility cases.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Syllogism Reasoning Rules', url: 'https://www.geeksforgeeks.org/syllogism-reasoning/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Syllogism Questions', url: 'https://www.indiabix.com/verbal-reasoning/syllogism/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-statement-conclusion',
            name: 'Statement and Conclusion',
            description: 'Direct vs indirect conclusions, distinguishing facts from assumptions, and checking validity.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['lr-syllogisms'],
            learningResources: [
              { title: 'IndiaBIX: Statement and Conclusion', url: 'https://www.indiabix.com/verbal-reasoning/statement-and-conclusion/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Statement and Conclusion Practice', url: 'https://www.indiabix.com/verbal-reasoning/statement-and-conclusion/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-assumptions-inferences',
            name: 'Assumptions and Inferences',
            description: 'Implicit premises, identifying unstated assumptions, and testing deductive validity.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['lr-statement-conclusion'],
            learningResources: [
              { title: 'IndiaBIX: Statement and Assumption', url: 'https://www.indiabix.com/verbal-reasoning/statement-and-assumption/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Statement and Assumption Questions', url: 'https://www.indiabix.com/verbal-reasoning/statement-and-assumption/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-venn-diagrams',
            name: 'Venn Diagrams',
            description: 'Geometric intersections representing sets, 2-circle and 3-circle population deduction.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'IndiaBIX: Venn Diagrams', url: 'https://www.indiabix.com/verbal-reasoning/venn-diagrams/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Venn Diagram Practice', url: 'https://www.indiabix.com/verbal-reasoning/venn-diagrams/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'lr-data-sufficiency',
            name: 'Data Sufficiency',
            description: 'Deciding whether Statement 1, Statement 2, both, or neither is sufficient to answer questions.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['lr-ranking-ordering', 'lr-blood-relations'],
            learningResources: [
              { title: 'IndiaBIX: Data Sufficiency Reasoning', url: 'https://www.indiabix.com/verbal-reasoning/data-sufficiency/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Data Sufficiency Questions', url: 'https://www.indiabix.com/verbal-reasoning/data-sufficiency/', platform: 'IndiaBIX' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 13: Verbal Ability
  // =========================================================================
  {
    id: 'verbal-ability',
    name: 'Verbal Ability',
    shortName: 'Verbal Ability',
    description: 'English grammar rules, vocabulary, reading comprehension, para jumbles, critical reasoning, and business communication.',
    category: 'Aptitude & Screening',
    iconName: 'BookOpen',
    topics: [
      {
        id: 'va-grammar-vocabulary',
        name: 'Grammar Fundamentals & Vocabulary',
        description: 'Parts of speech, tenses, subject-verb agreement, and vocabulary expansion.',
        subtopics: [
          {
            id: 'va-grammar-fundamentals',
            name: 'Grammar Fundamentals',
            description: 'Sentence structures, clauses (independent, dependent), modifiers, and punctuation rules.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: English Grammar Rules', url: 'https://www.geeksforgeeks.org/english-grammar/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Spotting Errors Questions', url: 'https://www.indiabix.com/verbal-ability/spotting-errors/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'va-parts-of-speech',
            name: 'Parts of Speech',
            description: 'Nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions, and interjections.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['va-grammar-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: Parts of Speech', url: 'https://www.geeksforgeeks.org/parts-of-speech-in-english-grammar/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Parts of Speech Quiz', url: 'https://www.geeksforgeeks.org/quizzes-on-english-grammar/', platform: 'Practice' },
            ],
          },
          {
            id: 'va-tenses',
            name: 'Tenses',
            description: 'Present, past, future tenses (simple, continuous, perfect, perfect continuous), and conditional sentences.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['va-parts-of-speech'],
            learningResources: [
              { title: 'GeeksforGeeks: Tenses in English', url: 'https://www.geeksforgeeks.org/tenses-in-english-grammar/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Sentence Completion Tenses', url: 'https://www.indiabix.com/verbal-ability/sentence-completion/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'va-subject-verb-agreement',
            name: 'Subject-Verb Agreement',
            description: 'Singular/plural agreement, collective nouns, either/or, neither/nor, and inverted sentences.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['va-parts-of-speech'],
            learningResources: [
              { title: 'GeeksforGeeks: Subject Verb Agreement Rules', url: 'https://www.geeksforgeeks.org/rules-of-subject-verb-agreement/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Spotting Errors on Subject-Verb', url: 'https://www.indiabix.com/verbal-ability/spotting-errors/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'va-articles-prepositions',
            name: 'Articles and Prepositions',
            description: 'Definite vs indefinite articles (a, an, the), prepositions of time, place, direction, and dependent prepositions.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['va-parts-of-speech'],
            learningResources: [
              { title: 'GeeksforGeeks: Articles and Prepositions', url: 'https://www.geeksforgeeks.org/articles-in-english-grammar/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Selecting Words - Prepositions', url: 'https://www.indiabix.com/verbal-ability/selecting-words/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'va-vocabulary',
            name: 'Vocabulary',
            description: 'High-frequency campus placement vocabulary, root words (Greek and Latin), prefixes, and suffixes.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Vocabulary for Campus Placements', url: 'https://www.geeksforgeeks.org/vocabulary/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Synonyms Practice', url: 'https://www.indiabix.com/verbal-ability/synonyms/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'va-synonyms-antonyms',
            name: 'Synonyms and Antonyms',
            description: 'Contextual synonym selection, antonym identification, shades of meaning, and tone evaluation.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['va-vocabulary'],
            learningResources: [
              { title: 'IndiaBIX: Antonyms Tests', url: 'https://www.indiabix.com/verbal-ability/antonyms/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Synonyms and Antonyms Tests', url: 'https://www.indiabix.com/verbal-ability/synonyms/', platform: 'IndiaBIX' },
            ],
          },
        ],
      },
      {
        id: 'va-comprehension-communication',
        name: 'Comprehension, Jumbles & Professional Communication',
        description: 'Error spotting, reading passages, para jumbles, critical reasoning, and business communication.',
        subtopics: [
          {
            id: 'va-sentence-correction',
            name: 'Sentence Correction',
            description: 'Parallelism, dangling modifiers, redundant phrasing, incorrect idioms, and tense consistency.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['va-subject-verb-agreement'],
            learningResources: [
              { title: 'GeeksforGeeks: Sentence Correction Rules', url: 'https://www.geeksforgeeks.org/sentence-correction-rules/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Sentence Correction Tests', url: 'https://www.indiabix.com/verbal-ability/sentence-correction/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'va-error-spotting',
            name: 'Error Spotting',
            description: 'Divided sentence analysis, identifying faulty segments, pronoun errors, and prepositional mistakes.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['va-sentence-correction'],
            learningResources: [
              { title: 'IndiaBIX: Spotting Errors Tutorial', url: 'https://www.indiabix.com/verbal-ability/spotting-errors/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Error Spotting Quiz', url: 'https://www.indiabix.com/verbal-ability/spotting-errors/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'va-sentence-completion',
            name: 'Sentence Completion',
            description: 'Single and double blank completions, tone matching, and semantic connector logic (however, therefore).',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['va-vocabulary'],
            learningResources: [
              { title: 'IndiaBIX: Sentence Completion', url: 'https://www.indiabix.com/verbal-ability/sentence-completion/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Sentence Completion Practice', url: 'https://www.indiabix.com/verbal-ability/sentence-completion/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'va-reading-comprehension',
            name: 'Reading Comprehension',
            description: 'Active reading, main idea extraction, author tone, inference questions, and vocabulary in context.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['va-vocabulary'],
            learningResources: [
              { title: 'GeeksforGeeks: Reading Comprehension Practice', url: 'https://www.geeksforgeeks.org/reading-comprehension-passages/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Comprehension Passages', url: 'https://www.indiabix.com/verbal-ability/comprehension/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'va-para-jumbles',
            name: 'Para Jumbles',
            description: 'Opening sentence identification, mandatory pairs, chronological connectors, and conclusion matching.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['va-grammar-fundamentals'],
            learningResources: [
              { title: 'GeeksforGeeks: Para Jumbles Tricks and Tips', url: 'https://www.geeksforgeeks.org/parajumbles-tricks-and-tips/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Ordering of Sentences', url: 'https://www.indiabix.com/verbal-ability/ordering-of-sentences/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'va-critical-reasoning',
            name: 'Critical Reasoning',
            description: 'Strengthening vs weakening arguments, paradoxes, flaws in reasoning, and assumption identification.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Advanced',
            prerequisites: ['va-reading-comprehension'],
            learningResources: [
              { title: 'GeeksforGeeks: Critical Reasoning Concepts', url: 'https://www.geeksforgeeks.org/critical-reasoning/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Logical Deduction Tests', url: 'https://www.indiabix.com/verbal-reasoning/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'va-business-communication',
            name: 'Business Communication',
            description: 'Formal email etiquette, concise writing, technical presentation vocabulary, and active listening.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Professional Communication Skills', url: 'https://www.geeksforgeeks.org/communication-skills/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Business Writing Scenarios', url: 'https://www.geeksforgeeks.org/interview-preparation-for-campus-placements/', platform: 'Practice' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 14: Software Engineering and Testing
  // =========================================================================
  {
    id: 'software-engineering-and-testing',
    name: 'Software Engineering and Testing',
    shortName: 'Software Eng & Testing',
    description: 'SDLC methodologies, Agile, Scrum, Git version control, unit/integration testing, CI/CD, and quality assurance.',
    category: 'Engineering & Delivery',
    iconName: 'ShieldCheck',
    topics: [
      {
        id: 'se-sdlc-agile',
        name: 'SDLC, Agile & Design Principles',
        description: 'Software development lifecycles, Agile scrum practices, and system requirements.',
        subtopics: [
          {
            id: 'se-sdlc',
            name: 'Software Development Life Cycle',
            description: 'Phases: Planning, Requirements analysis, Architectural design, Implementation, Testing, Deployment, Maintenance.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: SDLC Guide', url: 'https://www.geeksforgeeks.org/software-development-life-cycle-sdlc/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: SDLC Models Quiz', url: 'https://www.geeksforgeeks.org/software-engineering-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-waterfall-agile',
            name: 'Waterfall and Agile Methodologies',
            description: 'Sequential waterfall trade-offs vs iterative incremental Agile delivery, and sprint feedback loops.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['se-sdlc'],
            learningResources: [
              { title: 'GeeksforGeeks: Waterfall vs Agile Model', url: 'https://www.geeksforgeeks.org/difference-between-waterfall-and-agile-model/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Agile Concepts Quiz', url: 'https://www.geeksforgeeks.org/software-engineering-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-scrum-sprint',
            name: 'Scrum and Sprint Planning',
            description: 'Product Owner, Scrum Master, Developers, Sprint backlog, Daily Standups, Sprint Review, and Retrospectives.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['se-waterfall-agile'],
            learningResources: [
              { title: 'Atlassian: Scrum Guide', url: 'https://www.atlassian.com/agile/scrum', type: 'article' },
            ],
            practiceExercises: [
              { title: 'Practice: Scrum Ceremonies Scenarios', url: 'https://www.geeksforgeeks.org/agile-software-development/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-requirements-user-stories',
            name: 'Requirements and User Stories',
            description: 'Functional vs non-functional requirements, INVEST criteria for user stories, acceptance criteria, and epics.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['se-scrum-sprint'],
            learningResources: [
              { title: 'Atlassian: User Stories in Agile', url: 'https://www.atlassian.com/agile/project-management/user-stories', type: 'article' },
            ],
            practiceExercises: [
              { title: 'Practice: Requirements Engineering Quiz', url: 'https://www.geeksforgeeks.org/software-engineering-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-software-design',
            name: 'Software Design Fundamentals',
            description: 'Coupling vs cohesion, SOLID principles overview, modularity, and separation of concerns.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['se-sdlc'],
            learningResources: [
              { title: 'GeeksforGeeks: SOLID Principles in Software Design', url: 'https://www.geeksforgeeks.org/solid-principle-in-programming-understand-with-real-life-examples/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Software Architecture Quiz', url: 'https://www.geeksforgeeks.org/software-engineering-gq/', platform: 'Practice' },
            ],
          },
        ],
      },
      {
        id: 'se-git-testing-cicd',
        name: 'Version Control, Testing & CI/CD',
        description: 'Git workflows, test suites, quality metrics, and automated deployment pipelines.',
        subtopics: [
          {
            id: 'se-version-control',
            name: 'Version Control',
            description: 'Centralized vs distributed VCS, commit history graphs, repository remotes, and working tree states.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'Pro Git: About Version Control', url: 'https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Version Control Quiz', url: 'https://git-scm.com/doc', platform: 'Practice' },
            ],
          },
          {
            id: 'se-git-fundamentals',
            name: 'Git Fundamentals',
            description: 'git init, git clone, git add, git commit, git status, git log, git diff, and .gitignore files.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['se-version-control'],
            learningResources: [
              { title: 'Pro Git: Git Basics', url: 'https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'GitHub Skills: Introduction to Git', url: 'https://skills.github.com/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-github-workflows',
            name: 'GitHub Workflows',
            description: 'Forking, cloning, remote upstreams, managing SSH keys, and contributing to open-source.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['se-git-fundamentals'],
            learningResources: [
              { title: 'GitHub Docs: Collaborating with pull requests', url: 'https://docs.github.com/en/pull-requests', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'GitHub Skills: First Day on GitHub', url: 'https://skills.github.com/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-branches-prs',
            name: 'Branches and Pull Requests',
            description: 'Feature branching, git checkout -b, git merge, merge conflicts resolution, and pull request reviews.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['se-github-workflows'],
            learningResources: [
              { title: 'Pro Git: Git Branching', url: 'https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Resolving Git Conflicts', url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts', platform: 'Practice' },
            ],
          },
          {
            id: 'se-unit-testing',
            name: 'Unit Testing',
            description: 'Isolated component testing, test assertions, mocks, stubs, and unit test frameworks (Jest, JUnit, PyTest).',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['se-sdlc'],
            learningResources: [
              { title: 'GeeksforGeeks: Unit Testing Guide', url: 'https://www.geeksforgeeks.org/unit-testing-software-testing/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Writing Unit Tests', url: 'https://www.geeksforgeeks.org/software-engineering-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-integration-testing',
            name: 'Integration Testing',
            description: 'Top-down, bottom-up, big-bang, and sandwich integration testing between modules and external services.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['se-unit-testing'],
            learningResources: [
              { title: 'GeeksforGeeks: Integration Testing', url: 'https://www.geeksforgeeks.org/integration-testing-software-testing/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Integration Scenarios Quiz', url: 'https://www.geeksforgeeks.org/software-engineering-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-system-testing',
            name: 'System Testing',
            description: 'End-to-end functional validation, user acceptance testing (UAT), alpha/beta testing, and non-functional tests.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['se-integration-testing'],
            learningResources: [
              { title: 'GeeksforGeeks: System Testing', url: 'https://www.geeksforgeeks.org/system-testing-software-testing/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Testing Types Quiz', url: 'https://www.geeksforgeeks.org/software-engineering-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-regression-testing',
            name: 'Regression Testing',
            description: 'Smoke tests, sanity checks, regression test suites, and verifying code changes don\'t break existing features.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['se-unit-testing'],
            learningResources: [
              { title: 'GeeksforGeeks: Regression Testing', url: 'https://www.geeksforgeeks.org/regression-testing-software-testing/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Regression Test Strategies', url: 'https://www.geeksforgeeks.org/software-engineering-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-test-cases-bug-reporting',
            name: 'Test Cases and Bug Reporting',
            description: 'Test case template (Preconditions, Steps, Expected vs Actual), bug life cycle, severity vs priority.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['se-unit-testing'],
            learningResources: [
              { title: 'GeeksforGeeks: Bug Life Cycle', url: 'https://www.geeksforgeeks.org/bug-life-cycle-software-testing/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Writing Test Cases', url: 'https://www.geeksforgeeks.org/software-engineering-gq/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-cicd-fundamentals',
            name: 'CI/CD Fundamentals',
            description: 'Continuous Integration build automation, Continuous Delivery vs Continuous Deployment, and GitHub Actions.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['se-github-workflows', 'se-unit-testing'],
            learningResources: [
              { title: 'GeeksforGeeks: Introduction to CI/CD', url: 'https://www.geeksforgeeks.org/ci-cd-continuous-integration-and-continuous-delivery-deployment/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'GitHub Skills: Continuous Integration with Actions', url: 'https://skills.github.com/', platform: 'Practice' },
            ],
          },
          {
            id: 'se-code-quality',
            name: 'Code Quality and Maintainability',
            description: 'Linters, static code analysis, code review checklists, refactoring, and technical debt management.',
            estimatedTime: '45 mins',
            difficulty: 'Intermediate',
            prerequisites: ['se-software-design'],
            learningResources: [
              { title: 'GeeksforGeeks: Clean Code Principles', url: 'https://www.geeksforgeeks.org/7-clean-code-principles-every-developer-should-know/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Code Review Scenarios', url: 'https://www.geeksforgeeks.org/software-engineering-gq/', platform: 'Practice' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 15: Web Development and Full-Stack Fundamentals
  // =========================================================================
  {
    id: 'web-development',
    name: 'Web Development and Full-Stack Fundamentals',
    shortName: 'Full-Stack Web Dev',
    description: 'HTML5, CSS3, JavaScript, REST APIs, React frontend, Node.js/Express backend, MongoDB, and deployment.',
    category: 'Engineering & Delivery',
    iconName: 'Layout',
    topics: [
      {
        id: 'web-frontend-foundations',
        name: 'HTML, CSS & JavaScript Core',
        description: 'Semantic markup, modern styling layouts, and asynchronous JavaScript.',
        subtopics: [
          {
            id: 'web-html-fundamentals',
            name: 'HTML Fundamentals',
            description: 'HTML document structure, elements, attributes, forms, inputs, and document tree.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'MDN Web Docs: HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'W3Schools: HTML Exercises', url: 'https://www.w3schools.com/html/html_exercises.asp', platform: 'Practice' },
            ],
          },
          {
            id: 'web-semantic-html',
            name: 'Semantic HTML',
            description: 'header, nav, main, article, section, footer, aside, and accessibility benefits.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: ['web-html-fundamentals'],
            learningResources: [
              { title: 'MDN Web Docs: Semantic Elements', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Semantic HTML Layout', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML', platform: 'Practice' },
            ],
          },
          {
            id: 'web-css-fundamentals',
            name: 'CSS Fundamentals',
            description: 'Selectors, specificity, cascade, inheritance, box model (margin, border, padding, content), and display values.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['web-html-fundamentals'],
            learningResources: [
              { title: 'MDN Web Docs: CSS First Steps', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'W3Schools: CSS Box Model', url: 'https://www.w3schools.com/css/css_boxmodel.asp', platform: 'Practice' },
            ],
          },
          {
            id: 'web-flexbox-grid',
            name: 'Flexbox and Grid',
            description: 'Flex container axes, justify-content, align-items, flex-grow, and CSS Grid 2D layout template columns.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['web-css-fundamentals'],
            learningResources: [
              { title: 'MDN Web Docs: Basic Concepts of Flexbox', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Flexbox Froggy', url: 'https://flexboxfroggy.com/', platform: 'Practice' },
            ],
          },
          {
            id: 'web-responsive-design',
            name: 'Responsive Design',
            description: 'Viewport meta tag, media queries, mobile-first design, fluid units (rem, em, %, vh, vw), and Tailwind CSS utility classes.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['web-flexbox-grid'],
            learningResources: [
              { title: 'MDN Web Docs: Responsive Web Design', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Responsive Card Layout', url: 'https://www.w3schools.com/css/css_rwd_intro.asp', platform: 'Practice' },
            ],
          },
          {
            id: 'web-js-fundamentals',
            name: 'JavaScript Fundamentals',
            description: 'let vs const vs var, data types, arrow functions, template literals, destructuring, and spread/rest operators.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['web-html-fundamentals'],
            learningResources: [
              { title: 'MDN Web Docs: JavaScript First Steps', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'HackerRank: 10 Days of JavaScript', url: 'https://www.hackerrank.com/domains/tutorials/10-days-of-javascript', platform: 'HackerRank' },
            ],
          },
          {
            id: 'web-dom-events',
            name: 'DOM and Events',
            description: 'querySelector, addEventListener, event bubbling, event capturing, event delegation, and DOM updates.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['web-js-fundamentals'],
            learningResources: [
              { title: 'MDN Web Docs: Introduction to the DOM', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Interactive Event Handling', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events', platform: 'Practice' },
            ],
          },
          {
            id: 'web-async-js',
            name: 'Asynchronous JavaScript',
            description: 'Event loop, single-threaded execution, call stack, task queue, and microtask queue.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['web-js-fundamentals'],
            learningResources: [
              { title: 'MDN Web Docs: Introducing Asynchronous JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Event Loop Predictions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop', platform: 'Practice' },
            ],
          },
          {
            id: 'web-promises-async-await',
            name: 'Promises and async/await',
            description: 'Promise states (pending, fulfilled, rejected), .then/.catch chaining, async/await syntax, and Promise.all.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['web-async-js'],
            learningResources: [
              { title: 'MDN Web Docs: How to use Promises', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Async API Calls with Fetch', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch', platform: 'Practice' },
            ],
          },
        ],
      },
      {
        id: 'web-fullstack-architecture',
        name: 'React, Node, Express, MongoDB & APIs',
        description: 'Client-server protocols, modern React components, Express REST APIs, Mongoose, and deployment.',
        subtopics: [
          {
            id: 'web-http-rest-apis',
            name: 'HTTP and REST APIs',
            description: 'REST architecture, HTTP verbs (GET, POST, PUT, DELETE), status codes, headers, and idempotent methods.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['web-promises-async-await'],
            learningResources: [
              { title: 'MDN Web Docs: An Overview of HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: REST API Design Scenarios', url: 'https://www.geeksforgeeks.org/rest-api-introduction/', platform: 'Practice' },
            ],
          },
          {
            id: 'web-json',
            name: 'JSON',
            description: 'JSON syntax, JSON.stringify(), JSON.parse(), and serialization between client and server.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: ['web-js-fundamentals'],
            learningResources: [
              { title: 'MDN Web Docs: Working with JSON', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Parsing Nested JSON', url: 'https://www.w3schools.com/js/js_json_intro.asp', platform: 'Practice' },
            ],
          },
          {
            id: 'web-react-components-props',
            name: 'React Components and Props',
            description: 'JSX syntax, functional components, passing props, children prop, and component composition in CareerSense.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['web-js-fundamentals'],
            learningResources: [
              { title: 'React Official Documentation: Describing the UI', url: 'https://react.dev/learn/describing-the-ui', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'React Learn: Passing Props to a Component', url: 'https://react.dev/learn/passing-props-to-a-component', platform: 'Practice' },
            ],
          },
          {
            id: 'web-react-state-effects',
            name: 'State and Effects',
            description: 'useState for component memory, useEffect for side-effects/data fetching, cleanup functions, and dependencies array.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['web-react-components-props'],
            learningResources: [
              { title: 'React Official Documentation: Adding Interactivity', url: 'https://react.dev/learn/adding-interactivity', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'React Learn: Synchronizing with Effects', url: 'https://react.dev/learn/synchronizing-with-effects', platform: 'Practice' },
            ],
          },
          {
            id: 'web-react-forms-validation',
            name: 'Forms and Validation',
            description: 'Controlled vs uncontrolled inputs, form onSubmit handlers, input state bindings, and client validation feedback.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['web-react-state-effects'],
            learningResources: [
              { title: 'React Official Documentation: Responding to Events', url: 'https://react.dev/learn/responding-to-events', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Controlled Input Forms in React', url: 'https://react.dev/learn/sharing-state-between-components', platform: 'Practice' },
            ],
          },
          {
            id: 'web-react-routing',
            name: 'Routing',
            description: 'Single-page app routing (react-router-dom), BrowserRouter, Routes, Route, Link, useNavigate, and useParams.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['web-react-components-props'],
            learningResources: [
              { title: 'React Router Documentation: Tutorial', url: 'https://reactrouter.com/en/main/start/tutorial', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Configuring Client Routes', url: 'https://reactrouter.com/en/main/components/routes', platform: 'Practice' },
            ],
          },
          {
            id: 'web-node-fundamentals',
            name: 'Node.js Fundamentals',
            description: 'Node.js runtime, V8 engine, CommonJS vs ES Modules (import/export), npm scripts, and process object.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['web-js-fundamentals'],
            learningResources: [
              { title: 'Node.js Official Documentation: Getting Started', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Node.js CLI Modules', url: 'https://nodejs.org/en/learn', platform: 'Practice' },
            ],
          },
          {
            id: 'web-express-middleware',
            name: 'Express and Middleware',
            description: 'Express app routing, req/res/next lifecycle, express.json(), cors middleware, and custom error handling.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['web-node-fundamentals'],
            learningResources: [
              { title: 'Express.js Documentation: Using Middleware', url: 'https://expressjs.com/en/guide/using-middleware.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Building REST Endpoints with Express', url: 'https://expressjs.com/en/starter/basic-routing.html', platform: 'Practice' },
            ],
          },
          {
            id: 'web-auth-authorization',
            name: 'Authentication and Authorization',
            description: 'JSON Web Tokens (JWT), password hashing with bcrypt, Authorization Bearer header, and role-based access control.',
            estimatedTime: '2 hrs',
            difficulty: 'Advanced',
            prerequisites: ['web-express-middleware'],
            learningResources: [
              { title: 'Auth0: Introduction to JSON Web Tokens', url: 'https://jwt.io/introduction', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Protecting Routes with JWT Middleware in CareerSense', url: 'https://expressjs.com/en/guide/routing.html', platform: 'Practice' },
            ],
          },
          {
            id: 'web-mongodb-fundamentals',
            name: 'MongoDB Fundamentals',
            description: 'NoSQL document storage, BSON format, collections, documents, _id ObjectIds, and mongosh commands.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['dbms-fundamentals'],
            learningResources: [
              { title: 'MongoDB Documentation: Documents', url: 'https://www.mongodb.com/docs/manual/core/document/', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'MongoDB University: Basics Practice', url: 'https://www.mongodb.com/docs/manual/tutorial/getting-started/', platform: 'Practice' },
            ],
          },
          {
            id: 'web-mongoose-models',
            name: 'Mongoose Models and Validation',
            description: 'Mongoose schemas, types, custom validators, pre-save hooks, virtuals, and referencing ref: \'User\'.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['web-mongodb-fundamentals'],
            learningResources: [
              { title: 'Mongoose Documentation: Schemas', url: 'https://mongoosejs.com/docs/guide.html', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Defining Model Validations in CareerSense', url: 'https://mongoosejs.com/docs/validation.html', platform: 'Practice' },
            ],
          },
          {
            id: 'web-api-integration',
            name: 'API Integration',
            description: 'Connecting React client to Express server via fetch/apiRequest, handling auth headers, loading states, and error handling.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['web-react-state-effects', 'web-express-middleware'],
            learningResources: [
              { title: 'MDN Web Docs: Fetch API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Implementing Centralized API Client', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API', platform: 'Practice' },
            ],
          },
          {
            id: 'web-env-variables',
            name: 'Environment Variables',
            description: 'dotenv configuration, separating secrets from code, process.env in Node, and Vite import.meta.env prefix rules.',
            estimatedTime: '30 mins',
            difficulty: 'Beginner',
            prerequisites: ['web-node-fundamentals'],
            learningResources: [
              { title: 'Vite Documentation: Env Variables and Modes', url: 'https://vite.dev/guide/env-and-mode', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Creating Safe .env.example templates', url: 'https://vite.dev/guide/env-and-mode.html', platform: 'Practice' },
            ],
          },
          {
            id: 'web-deployment-fundamentals',
            name: 'Deployment Fundamentals',
            description: 'Vite production build (npm run build), static asset serving, reverse proxies, and production CORS configuration.',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['web-api-integration'],
            learningResources: [
              { title: 'Vite Documentation: Building for Production', url: 'https://vite.dev/guide/build', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'Practice: Production Build Verification', url: 'https://vite.dev/guide/build.html', platform: 'Practice' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SUBJECT 16: Placement and Interview Preparation
  // =========================================================================
  {
    id: 'placement-and-interview-prep',
    name: 'Placement and Interview Preparation',
    shortName: 'Placement & Interviews',
    description: 'ATS resume formatting, project defense, technical interviews across core CS, behavioral STAR method, and coding test strategy.',
    category: 'Career & Placement',
    iconName: 'Award',
    topics: [
      {
        id: 'pip-resume-portfolio',
        name: 'Resume, Projects & Portfolio Presentation',
        description: 'Creating ATS-compliant resumes, presenting engineering projects, and GitHub portfolio setup.',
        subtopics: [
          {
            id: 'pip-resume-preparation',
            name: 'Resume Preparation',
            description: 'Clean single-page format, reverse-chronological order, academic credentials, and quantifiable achievements.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: How to Prepare Resume for Campus Placements', url: 'https://www.geeksforgeeks.org/resume-building-for-freshers/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'CareerSense: Resume Builder and Upload in Student Profile', url: 'https://www.geeksforgeeks.org/how-to-write-a-resume/', platform: 'Practice' },
            ],
          },
          {
            id: 'pip-ats-resume',
            name: 'ATS-Friendly Resume Fundamentals',
            description: 'Applicant Tracking Systems keyword parsing, avoiding unparseable tables/graphics, standard section headers, and PDF export.',
            estimatedTime: '45 mins',
            difficulty: 'Beginner',
            prerequisites: ['pip-resume-preparation'],
            learningResources: [
              { title: 'GeeksforGeeks: What is an ATS Friendly Resume?', url: 'https://www.geeksforgeeks.org/what-is-an-ats-resume-and-how-to-make-it/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: ATS Keyword Verification', url: 'https://www.geeksforgeeks.org/resume-building-for-freshers/', platform: 'Practice' },
            ],
          },
          {
            id: 'pip-explaining-projects',
            name: 'Explaining Academic Projects',
            description: 'Architecture overview, problem statement, technology stack justification, individual contribution, and overcoming roadblocks.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: How to Explain Projects in Technical Interviews', url: 'https://www.geeksforgeeks.org/how-to-explain-projects-in-a-job-interview/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'CareerSense: Projects Showcase and Defense Preparation', url: 'https://www.geeksforgeeks.org/how-to-explain-projects-in-a-job-interview/', platform: 'Practice' },
            ],
          },
          {
            id: 'pip-github-portfolio',
            name: 'GitHub Portfolio Presentation',
            description: 'Professional README files, live demo links, architecture diagrams, commit history, and pinned showcase repositories.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['se-github-workflows'],
            learningResources: [
              { title: 'GitHub Docs: Managing Your Profile README', url: 'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme', type: 'documentation' },
            ],
            practiceExercises: [
              { title: 'GitHub Skills: Profile README Lab', url: 'https://skills.github.com/', platform: 'Practice' },
            ],
          },
        ],
      },
      {
        id: 'pip-technical-interviews',
        name: 'Technical Round Preparation by Subject',
        description: 'Comprehensive subject-wise interview questions across OOP, DBMS, OS, CN, DSA, and SQL.',
        subtopics: [
          {
            id: 'pip-tech-interview-fundamentals',
            name: 'Technical Interview Fundamentals',
            description: 'Think-aloud protocol, clarifying problem constraints, time/space trade-off explanation, and dry running code on whiteboard.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Technical Interview Preparation Guide', url: 'https://www.geeksforgeeks.org/must-do-coding-questions-for-companies-like-amazon-microsoft-adobe/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Whiteboard Coding Drills', url: 'https://leetcode.com/explore/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'pip-oop-interview-questions',
            name: 'OOP Interview Questions',
            description: 'Real-world OOP questions: Diamond problem, abstract class vs interface, method dispatch, and design patterns.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['oop-classes-objects'],
            learningResources: [
              { title: 'GeeksforGeeks: Top 50 OOPs Interview Questions', url: 'https://www.geeksforgeeks.org/oops-interview-questions/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: OOP Placement Interview Mock', url: 'https://www.geeksforgeeks.org/oops-interview-questions/', platform: 'Practice' },
            ],
          },
          {
            id: 'pip-dbms-interview-questions',
            name: 'DBMS Interview Questions',
            description: 'ACID scenarios, clustered vs non-clustered indexes, normalization trade-offs, and deadlock resolution.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['dbms-normalization-transactions'],
            learningResources: [
              { title: 'GeeksforGeeks: Commonly Asked DBMS Interview Questions', url: 'https://www.geeksforgeeks.org/commonly-asked-dbms-interview-questions/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: DBMS Interview Drills', url: 'https://www.geeksforgeeks.org/commonly-asked-dbms-interview-questions/', platform: 'Practice' },
            ],
          },
          {
            id: 'pip-os-interview-questions',
            name: 'OS Interview Questions',
            description: 'Process vs thread memory, virtual memory page faults, synchronization primitives, and fork() state duplication.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['os-interview-questions'],
            learningResources: [
              { title: 'GeeksforGeeks: Operating System Interview Questions', url: 'https://www.geeksforgeeks.org/operating-system-interview-questions/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: OS Interview Practice Set', url: 'https://www.geeksforgeeks.org/operating-system-interview-questions/', platform: 'Practice' },
            ],
          },
          {
            id: 'pip-cn-interview-questions',
            name: 'CN Interview Questions',
            description: 'Complete trace of what happens when URL is entered into browser, TCP vs UDP in real applications, and subnetting.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['cn-interview-questions'],
            learningResources: [
              { title: 'GeeksforGeeks: Computer Network Interview Questions', url: 'https://www.geeksforgeeks.org/computer-network-interview-questions/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Networking Interview Scenario Drills', url: 'https://www.geeksforgeeks.org/computer-network-interview-questions/', platform: 'Practice' },
            ],
          },
          {
            id: 'pip-dsa-interview-practice',
            name: 'DSA Interview Practice',
            description: 'Timed mock coding rounds on arrays, two pointers, binary search, trees, dynamic programming, and graphs.',
            estimatedTime: '3 hrs',
            difficulty: 'Advanced',
            prerequisites: ['dsa-interview-problems'],
            learningResources: [
              { title: 'LeetCode Top Interview 150', url: 'https://leetcode.com/studyplan/top-interview-150/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 1: Two Sum and Linked Lists', url: 'https://leetcode.com/problemset/all/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'pip-sql-interview-practice',
            name: 'SQL Interview Practice',
            description: 'Multi-table join queries, window functions (ROW_NUMBER, DENSE_RANK), self-joins, and aggregations.',
            estimatedTime: '2 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['dbms-sql-interview-questions'],
            learningResources: [
              { title: 'LeetCode Top SQL 50', url: 'https://leetcode.com/studyplan/top-sql-50/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'LeetCode 178: Rank Scores', url: 'https://leetcode.com/problems/rank-scores/', platform: 'LeetCode' },
            ],
          },
        ],
      },
      {
        id: 'pip-hr-behavioral-strategy',
        name: 'Coding Tests, Mock Tests & HR Behavioral Rounds',
        description: 'Online assessment strategies, aptitude tests, STAR technique, and HR interview answers.',
        subtopics: [
          {
            id: 'pip-coding-test-strategy',
            name: 'Coding Test Strategy',
            description: 'Time management across online assessment platforms (HackerRank, HackerEarth), edge case verification, and partial credit tactics.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: Online Assessment Strategies', url: 'https://www.geeksforgeeks.org/how-to-prepare-for-online-coding-assessments/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Timed Contest Simulations on LeetCode', url: 'https://leetcode.com/contest/', platform: 'LeetCode' },
            ],
          },
          {
            id: 'pip-aptitude-mock-tests',
            name: 'Aptitude Mock Tests',
            description: 'Sectional time division, skipping time-sink questions, negative marking strategy, and accuracy benchmarks.',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['qa-percentages', 'lr-number-series'],
            learningResources: [
              { title: 'IndiaBIX: General Aptitude Mock Tests', url: 'https://www.indiabix.com/online-test/aptitude-test/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'IndiaBIX: Full-Length Online Mock Test', url: 'https://www.indiabix.com/online-test/aptitude-test/', platform: 'IndiaBIX' },
            ],
          },
          {
            id: 'pip-behavioral-questions',
            name: 'Behavioral Interview Questions',
            description: 'Common placement questions: Tell me about yourself, strengths/weaknesses, handling conflicts, and adaptability.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: HR Interview Questions and Answers', url: 'https://www.geeksforgeeks.org/hr-interview-questions-and-answers/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Behavioral Answer Formulations', url: 'https://www.geeksforgeeks.org/hr-interview-questions-and-answers/', platform: 'Practice' },
            ],
          },
          {
            id: 'pip-hr-interview-prep',
            name: 'HR Interview Preparation',
            description: 'Company research, understanding values and recent news, asking insightful reverse questions to the interviewer.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: ['pip-behavioral-questions'],
            learningResources: [
              { title: 'GeeksforGeeks: Questions to Ask the HR Interviewer', url: 'https://www.geeksforgeeks.org/top-10-questions-to-ask-in-an-hr-interview/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Reverse Question Preparation', url: 'https://www.geeksforgeeks.org/top-10-questions-to-ask-in-an-hr-interview/', platform: 'Practice' },
            ],
          },
          {
            id: 'pip-star-method',
            name: 'STAR Method',
            description: 'Structuring behavioral examples: Situation (context), Task (goal), Action (your specific initiative), Result (quantifiable impact).',
            estimatedTime: '1 hr',
            difficulty: 'Intermediate',
            prerequisites: ['pip-behavioral-questions'],
            learningResources: [
              { title: 'GeeksforGeeks: The STAR Method for Interview Success', url: 'https://www.geeksforgeeks.org/the-star-method-for-interviews/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Drafting STAR Responses for Projects', url: 'https://www.geeksforgeeks.org/the-star-method-for-interviews/', platform: 'Practice' },
            ],
          },
          {
            id: 'pip-communication-intro',
            name: 'Communication and Self-Introduction',
            description: '60-to-90 second elevator pitch, tone modulation, non-verbal posture, and maintaining clarity under pressure.',
            estimatedTime: '1 hr',
            difficulty: 'Beginner',
            prerequisites: [],
            learningResources: [
              { title: 'GeeksforGeeks: How to Introduce Yourself in an Interview', url: 'https://www.geeksforgeeks.org/how-to-introduce-yourself-in-an-interview/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Self Introduction Timed Recordings', url: 'https://www.geeksforgeeks.org/how-to-introduce-yourself-in-an-interview/', platform: 'Practice' },
            ],
          },
          {
            id: 'pip-company-specific-plans',
            name: 'Company-Specific Preparation Plans',
            description: 'Pattern analysis and round structures for major placement recruiters (TCS Ninja/Digital, Infosys DSE/SP, Wipro, Accenture).',
            estimatedTime: '1.5 hrs',
            difficulty: 'Intermediate',
            prerequisites: ['pip-coding-test-strategy'],
            learningResources: [
              { title: 'GeeksforGeeks: Company-Specific Placement Preparation', url: 'https://www.geeksforgeeks.org/company-preparation/', type: 'tutorial' },
            ],
            practiceExercises: [
              { title: 'Practice: Campus Drive Test Simulations in CareerSense', url: 'https://www.geeksforgeeks.org/company-preparation/', platform: 'Practice' },
            ],
          },
        ],
      },
    ],
  },
];

// Flat lookup indices for fast validation and performance
export const SUBTOPIC_MAP = new Map();
export const TOPIC_MAP = new Map();
export const SUBJECT_MAP = new Map();

// Populate indices
PREPARATION_SYLLABUS.forEach((subject) => {
  SUBJECT_MAP.set(subject.id, subject);
  subject.topics.forEach((topic) => {
    TOPIC_MAP.set(topic.id, { ...topic, subjectId: subject.id });
    topic.subtopics.forEach((subtopic) => {
      SUBTOPIC_MAP.set(subtopic.id, {
        ...subtopic,
        topicId: topic.id,
        topicName: topic.name,
        subjectId: subject.id,
        subjectName: subject.name,
      });
    });
  });
});

export const TOTAL_SUBTOPICS_COUNT = SUBTOPIC_MAP.size;

/**
 * Helper to calculate topic, subject, and overall progress
 */
export function calculateSyllabusProgress(completedSubtopicIds = []) {
  const completedSet = new Set(
    Array.isArray(completedSubtopicIds)
      ? completedSubtopicIds.map((id) => (typeof id === 'string' ? id : id?.subtopicId)).filter(Boolean)
      : []
  );

  const topicProgress = {};
  const subjectProgress = {};

  let totalIncludedSubtopics = 0;
  let totalCompletedSubtopics = 0;

  PREPARATION_SYLLABUS.forEach((subject) => {
    let subjectTotal = 0;
    let subjectCompleted = 0;

    subject.topics.forEach((topic) => {
      const topicTotal = topic.subtopics.length;
      const topicCompleted = topic.subtopics.filter((st) => completedSet.has(st.id)).length;

      subjectTotal += topicTotal;
      subjectCompleted += topicCompleted;

      topicProgress[topic.id] = {
        topicId: topic.id,
        name: topic.name,
        completedCount: topicCompleted,
        totalCount: topicTotal,
        progress: topicTotal > 0 ? Math.round((topicCompleted / topicTotal) * 100) : 0,
      };
    });

    totalIncludedSubtopics += subjectTotal;
    totalCompletedSubtopics += subjectCompleted;

    subjectProgress[subject.id] = {
      subjectId: subject.id,
      name: subject.name,
      shortName: subject.shortName,
      category: subject.category,
      completedCount: subjectCompleted,
      totalCount: subjectTotal,
      progress: subjectTotal > 0 ? Math.round((subjectCompleted / subjectTotal) * 100) : 0,
    };
  });

  const overallProgress =
    totalIncludedSubtopics > 0
      ? Math.round((totalCompletedSubtopics / totalIncludedSubtopics) * 100)
      : 0;

  return {
    overallProgress,
    totalSubtopics: totalIncludedSubtopics,
    completedCount: totalCompletedSubtopics,
    remainingCount: Math.max(0, totalIncludedSubtopics - totalCompletedSubtopics),
    topicProgress,
    subjectProgress,
  };
}

/**
 * Deterministic recommendation for next topic based on prerequisites and completion
 */
export function getNextRecommendedTopic(completedSubtopicIds = []) {
  const completedSet = new Set(
    Array.isArray(completedSubtopicIds)
      ? completedSubtopicIds.map((id) => (typeof id === 'string' ? id : id?.subtopicId)).filter(Boolean)
      : []
  );

  for (const subject of PREPARATION_SYLLABUS) {
    for (const topic of subject.topics) {
      for (const subtopic of topic.subtopics) {
        if (!completedSet.has(subtopic.id)) {
          const prereqsMet = (subtopic.prerequisites || []).every((pId) => completedSet.has(pId));
          if (prereqsMet) {
            return {
              subtopicId: subtopic.id,
              subtopicName: subtopic.name,
              topicId: topic.id,
              topicName: topic.name,
              subjectId: subject.id,
              subjectName: subject.name,
              difficulty: subtopic.difficulty,
              estimatedTime: subtopic.estimatedTime,
              rationale:
                subtopic.prerequisites && subtopic.prerequisites.length > 0
                  ? `Prerequisites completed in ${topic.name}. Step up to ${subtopic.name}.`
                  : `Next foundational milestone in ${subject.name}.`,
            };
          }
        }
      }
    }
  }

  return null;
}

export default PREPARATION_SYLLABUS;
