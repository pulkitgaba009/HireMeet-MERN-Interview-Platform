export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution.",
        "You may not use the same element twice.",
      ],
    },
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
}

console.log(twoSum([2,7,11,15],9));
console.log(twoSum([3,2,4],6));
console.log(twoSum([3,3],6));`,
      python: `def twoSum(nums, target):
    pass

print(twoSum([2,7,11,15],9))
print(twoSum([3,2,4],6))
print(twoSum([3,3],6))`,
      java: `import java.util.*;
class Solution {
  public static int[] twoSum(int[] nums, int target) {
    return new int[0];
  }
  public static void main(String[] args) {
    System.out.println(Arrays.toString(twoSum(new int[]{2,7,11,15},9)));
    System.out.println(Arrays.toString(twoSum(new int[]{3,2,4},6)));
    System.out.println(Arrays.toString(twoSum(new int[]{3,3},6)));
  }
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums,int n,int target,int* rs){
  *rs=2;
  int* r=malloc(2*sizeof(int));
  for(int i=0;i<n;i++)
    for(int j=i+1;j<n;j++)
      if(nums[i]+nums[j]==target){r[0]=i;r[1]=j;return r;}
  return r;
}

int main(){
  int rs;
  int a1[]={2,7,11,15};
  int* r1=twoSum(a1,4,9,&rs);
  printf("[%d,%d]\n",r1[0],r1[1]);
  int a2[]={3,2,4};
  int* r2=twoSum(a2,3,6,&rs);
  printf("[%d,%d]\n",r2[0],r2[1]);
  int a3[]={3,3};
  int* r3=twoSum(a3,2,6,&rs);
  printf("[%d,%d]",r3[0],r3[1]);
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums,int target){
  for(int i=0;i<nums.size();i++)
    for(int j=i+1;j<nums.size();j++)
      if(nums[i]+nums[j]==target) return {i,j};
  return {};
}

int main(){
  auto r1=twoSum(vector<int>{2,7,11,15},9);
  cout<<"["<<r1[0]<<","<<r1[1]<<"]\n";
  auto r2=twoSum(vector<int>{3,2,4},6);
  cout<<"["<<r2[0]<<","<<r2[1]<<"]\n";
  auto r3=twoSum(vector<int>{3,3},6);
  cout<<"["<<r3[0]<<","<<r3[1]<<"]";
}`,
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]\n[0,1]",
      python: "[0, 1]\n[1, 2]\n[0, 1]",
      java: "[0, 1]\n[1, 2]\n[0, 1]",
      c: "[0,1]\n[1,2]\n[0,1]",
      cpp: "[0,1]\n[1,2]\n[0,1]",
    },
  },

"reverse-string": {
  id: "reverse-string",
  title: "Reverse String",
  difficulty: "Easy",
  category: "String • Two Pointers",

  description: {
    text: "Write a function that reverses a string. The input string is given as an array of characters s.",
    notes: [
      "You must do this by modifying the input array in-place with O(1) extra memory.",
      "The order of characters should be reversed."
    ],
  },

  examples: [
    {
      input: 's = ["h","e","l","l","o"]',
      output: '["o","l","l","e","h"]',
      explanation: "The string is reversed in-place."
    },
    {
      input: 's = ["H","a","n","n","a","h"]',
      output: '["h","a","n","n","a","H"]',
    }
  ],

  constraints: [
    "1 ≤ s.length ≤ 10⁵",
    "s[i] is a printable ASCII character"
  ],

  starterCode: {
    javascript: `function reverseString(s) {
  // Write your solution here
}

let a=["h","e","l","l","o"];
reverseString(a);
console.log(a);

let b=["H","a","n","n","a","h"];
reverseString(b);
console.log(b);`,

    python: `def reverseString(s):
    pass

a=list("hello")
reverseString(a)
print(a)

b=list("Hannah")
reverseString(b)
print(b)`,

    java: `import java.util.*;
class Solution {
  static void reverseString(char[] s){
    // Write your solution here
  }
  public static void main(String[] args){
    char[] a={'h','e','l','l','o'};
    reverseString(a);
    System.out.println(Arrays.toString(a));
    char[] b={'H','a','n','n','a','h'};
    reverseString(b);
    System.out.println(Arrays.toString(b));
  }
}`,

    c: `#include <stdio.h>
void reverse(char*s,int n){
  // Write your solution here
}
int main(){
  char a[]="hello";
  reverse(a,5);
  printf("%s\n",a);
  char b[]="Hannah";
  reverse(b,6);
  printf("%s",b);
}`,

    cpp: `#include <bits/stdc++.h>
using namespace std;
int main(){
  string a="hello";
  reverse(a.begin(),a.end());
  cout<<a<<endl;
  string b="Hannah";
  reverse(b.begin(),b.end());
  cout<<b;
}`,
  },

  expectedOutput: {
    javascript: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
    python: "['o', 'l', 'l', 'e', 'h']\n['h', 'a', 'n', 'n', 'a', 'H']",
    java: "[o, l, l, e, h]\n[h, a, n, n, a, H]",
    c: "olleh\nhannaH",
    cpp: "olleh\nhannaH",
  },
},


"valid-palindrome": {
  id: "valid-palindrome",
  title: "Valid Palindrome",
  difficulty: "Easy",
  category: "String • Two Pointers",

  description: {
    text: "Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.",
    notes: [
      "Non-alphanumeric characters should be ignored.",
      "Uppercase and lowercase letters are treated as the same."
    ],
  },

  examples: [
    {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: "After removing non-alphanumeric characters and ignoring cases, it reads the same forwards and backwards."
    },
    {
      input: 's = "race a car"',
      output: "false",
    },
    {
      input: 's = " "',
      output: "true",
    }
  ],

  constraints: [
    "1 ≤ s.length ≤ 2 × 10⁵",
    "s consists only of printable ASCII characters"
  ],

  starterCode: {
    javascript: `function isPalindrome(s) {
  // Write your solution here
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("race a car"));
console.log(isPalindrome(" "));`,

    python: `def isPalindrome(s):
    pass

print(isPalindrome("A man, a plan, a canal: Panama"))
print(isPalindrome("race a car"))
print(isPalindrome(" "))`,

    java: `class Solution {
  static boolean isPalindrome(String s){
    // Write your solution here
    return false;
  }
  public static void main(String[] args){
    System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
    System.out.println(isPalindrome("race a car"));
    System.out.println(isPalindrome(" "));
  }
}`,

    c: `#include <stdio.h>
#include <ctype.h>
#include <string.h>
int isPal(char*s){
  // Write your solution here
  return 0;
}
int main(){
  printf("%s\n",isPal("A man, a plan, a canal: Panama")?"true":"false");
  printf("%s\n",isPal("race a car")?"true":"false");
  printf("%s",isPal(" ")?"true":"false");
}`,

    cpp: `#include <bits/stdc++.h>
using namespace std;
int main(){
  auto isPal=[&](string s){
    // Write your solution here
    return false;
  };
  cout<<(isPal("A man, a plan, a canal: Panama")?"true":"false")<<endl;
  cout<<(isPal("race a car")?"true":"false")<<endl;
  cout<<(isPal(" ")?"true":"false");
}`,
  },

  expectedOutput: {
    javascript: "true\nfalse\ntrue",
    python: "True\nFalse\nTrue",
    java: "true\nfalse\ntrue",
    c: "true\nfalse\ntrue",
    cpp: "true\nfalse\ntrue",
  },
},
 "valid-palindrome": {
  id: "valid-palindrome",
  title: "Valid Palindrome",
  difficulty: "Easy",
  category: "String • Two Pointers",

  description: {
    text: "Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.",
    notes: [
      "Non-alphanumeric characters should be ignored.",
      "Uppercase and lowercase letters are treated as the same."
    ],
  },

  examples: [
    {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: "After removing non-alphanumeric characters and ignoring cases, it reads the same forwards and backwards."
    },
    {
      input: 's = "race a car"',
      output: "false",
    },
    {
      input: 's = " "',
      output: "true",
    }
  ],

  constraints: [
    "1 ≤ s.length ≤ 2 × 10⁵",
    "s consists only of printable ASCII characters"
  ],

  starterCode: {
    javascript: `function isPalindrome(s) {
  // Write your solution here
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("race a car"));
console.log(isPalindrome(" "));`,

    python: `def isPalindrome(s):
    pass

print(isPalindrome("A man, a plan, a canal: Panama"))
print(isPalindrome("race a car"))
print(isPalindrome(" "))`,

    java: `class Solution {
  static boolean isPalindrome(String s){
    // Write your solution here
    return false;
  }
  public static void main(String[] args){
    System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
    System.out.println(isPalindrome("race a car"));
    System.out.println(isPalindrome(" "));
  }
}`,

    c: `#include <stdio.h>
#include <ctype.h>
#include <string.h>
int isPal(char*s){
  // Write your solution here
  return 0;
}
int main(){
  printf("%s\n",isPal("A man, a plan, a canal: Panama")?"true":"false");
  printf("%s\n",isPal("race a car")?"true":"false");
  printf("%s",isPal(" ")?"true":"false");
}`,

    cpp: `#include <bits/stdc++.h>
using namespace std;
int main(){
  auto isPal=[&](string s){
    // Write your solution here
    return false;
  };
  cout<<(isPal("A man, a plan, a canal: Panama")?"true":"false")<<endl;
  cout<<(isPal("race a car")?"true":"false")<<endl;
  cout<<(isPal(" ")?"true":"false");
}`,
  },

  expectedOutput: {
    javascript: "true\nfalse\ntrue",
    python: "True\nFalse\nTrue",
    java: "true\nfalse\ntrue",
    c: "true\nfalse\ntrue",
    cpp: "true\nfalse\ntrue",
  },
},


  // MEDIUM 1
  "longest-substring-without-repeating-characters": {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String • Sliding Window",
    description: {
      text: "Given a string s, find the length of the longest substring without repeating characters.",
      notes: ["Substring must be contiguous."],
    },
    examples: [
      { input: `s = "abcabcbb"`, output: "3" },
      { input: `s = "bbbbb"`, output: "1" },
      { input: `s = "pwwkew"`, output: "3" },
    ],
    constraints: [
      "0 ≤ s.length ≤ 10⁵",
      "s consists of English letters, digits, symbols and spaces",
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your solution here
}`,
      python: `def lengthOfLongestSubstring(s):
    pass`,
      java: `class Solution {
  public int lengthOfLongestSubstring(String s) {
    return 0;
  }
}`,
      c: `int lengthOfLongestSubstring(char* s) {
  return 0;
}`,
      cpp: `int lengthOfLongestSubstring(string s) {
  return 0;
}`,
    },
    expectedOutput: {
      javascript: "3\n1\n3",
      python: "3\n1\n3",
      java: "3\n1\n3",
      c: "3\n1\n3",
      cpp: "3\n1\n3",
    },
  },

  // MEDIUM 2
  "product-of-array-except-self": {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array • Prefix Sum",
    description: {
      text: "Given an integer array nums, return an array answer such that answer[i] is the product of all the elements of nums except nums[i].",
      notes: ["You must solve it without division.", "Time complexity O(n)."],
    },
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁵", "-30 ≤ nums[i] ≤ 30"],
    starterCode: {
      javascript: `function productExceptSelf(nums) {
  // Write your solution here
}`,
      python: `def productExceptSelf(nums):
    pass`,
      java: `class Solution {
  public int[] productExceptSelf(int[] nums) {
    return new int[0];
  }
}`,
      c: `int* productExceptSelf(int* nums, int n, int* rs) {
  return NULL;
}`,
      cpp: `vector<int> productExceptSelf(vector<int>& nums) {
  return {};
}`,
    },
    expectedOutput: {
      javascript: "[24,12,8,6]\n[0,0,9,0,0]",
      python: "[24, 12, 8, 6]\n[0, 0, 9, 0, 0]",
      java: "[24, 12, 8, 6]\n[0, 0, 9, 0, 0]",
      c: "[24,12,8,6]\n[0,0,9,0,0]",
      cpp: "[24,12,8,6]\n[0,0,9,0,0]",
    },
  },

  // HARD 1
  "merge-k-sorted-lists": {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked List • Heap",
    description: {
      text: "You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.",
      notes: ["Try using a min heap."],
    },
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
    ],
    constraints: [
      "k == lists.length",
      "0 ≤ k ≤ 10⁴",
      "0 ≤ lists[i].length ≤ 500",
    ],
    starterCode: {
      javascript: `function mergeKLists(lists) {
  // Write your solution here
}`,
      python: `def mergeKLists(lists):
    pass`,
      java: `class Solution {
  public ListNode mergeKLists(ListNode[] lists) {
    return null;
  }
}`,
      c: `struct ListNode* mergeKLists(struct ListNode** lists, int k) {
  return NULL;
}`,
      cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
  return nullptr;
}`,
    },
    expectedOutput: {
      javascript: "[1,1,2,3,4,4,5,6]",
      python: "[1,1,2,3,4,4,5,6]",
      java: "[1,1,2,3,4,4,5,6]",
      c: "[1,1,2,3,4,4,5,6]",
      cpp: "[1,1,2,3,4,4,5,6]",
    },
  },

  // HARD 2
  "median-of-two-sorted-arrays": {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array • Binary Search",
    description: {
      text: "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays.",
      notes: ["Time complexity must be O(log(min(n,m)))."],
    },
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.0" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5" },
    ],
    constraints: ["0 ≤ nums1.length ≤ 1000", "0 ≤ nums2.length ≤ 1000"],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
}`,
      python: `def findMedianSortedArrays(nums1, nums2):
    pass`,
      java: `class Solution {
  public double findMedianSortedArrays(int[] nums1, int[] nums2) {
    return 0.0;
  }
}`,
      c: `double findMedianSortedArrays(int* nums1, int n1, int* nums2, int n2) {
  return 0.0;
}`,
      cpp: `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
  return 0.0;
}`,
    },
    expectedOutput: {
      javascript: "2.0\n2.5",
      python: "2.0\n2.5",
      java: "2.0\n2.5",
      c: "2.0\n2.5",
      cpp: "2.0\n2.5",
    },
  },
};

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },
  c: {
    name: "C",
    icon: "/c.png",
    monacoLang: "c",
  },
  cpp: {
    name: "C++",
    icon: "/cpp.png",
    monacoLang: "cpp",
  },
};
