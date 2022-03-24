// Task 2
// a) Provide line by line analysis of the performance of the below code in terms of Big O notation, as well as the overall performance of the function.
// b) Write a new solution that has better performance, explaining why it has higher performance and if there are any other improvements possible.

const domains = {  // Example to show data shape only.
 "one.com": { policy: "block" },
 "two.com": { policy: "none" },
 "three.com": { policy: "none" },
}

// Assuming Object.keys, Object.entries, Object.values are all O(n).

const getBlockPolicyState = (domains) => { // size of input (domains) referred to as (n)
 const policyArr = []; // grows in space by keys(domains). Time: (1), Space: (n)
 const numDomains = Object.keys(domains).length; // Time: (n + 1), Space: (1)

 for (let i = 0; i < numDomains; i++) { // iterates over all keys of input (domains). (n)
   policyArr.push(Object.entries(domains)[i][1].policy); // Time: (n + 1), Space: (n) all elements from domains is pushed to policyArr
 }

 const oneDomain = policyArr.some((item) => item === "block"); // policyArr respects size of input (domains). Worst case iteration: Time: (n), Space: (1) 
 const allDomains = policyArr.every((item) => item === "block"); // policyArr respects size of input (domains). Worst case iteration: Time: (n), Space: (1) 
 // The above 2 statements are linked. If the worst case occurs for one, the best case is likely to occur for the other.

 return { oneDomain, allDomains }; // constant (1)
};


// Time complexity: O(n^2). Before discarding: O(4n^2 + 5)
// Space complecity: O(n)

const getBlockPolicyStateRefactor = (domains) => { // size of input (domains) referred to as (n)
  let oneDomain = false // constant (1)
  let allDomains = true // constant (1)

  Object.values(domains).forEach(({policy}) => { // Calls Object.values, iterates over every key in domains - (n + n)
    if(policy === 'block') { // constant (1)
      oneDomain = true // constant (1)
    } else {
      allDomains = false // constant (1)
      if(oneDomain) { // constant (1)
        return {oneDomain, allDomains}
      }
    }
  })

  return {oneDomain, allDomains} // constant (1)
}

// Time complexity: O(n). Before discarding: O(5n + 3)
// Space complecity: O(1)

/**
 * Explanation:
 * Space: Space complexity is improved because in getBlockPolicyState, policyArr is assigned to and grows based on the size of the input. getBlockPolicyStateRefactor is only making use of constant variables.
 * Time: In getBlockPolicyState time complexity is significantly increased due to calling Object.entries inside the for loop. Time complexity is improved by not doing this and by returning early. 
 * 
 * There are also improvemnets in the best case: 
 * 
 * Example: Suppose the first 2 records had policies of "block" and then "none". 
 * getBlockPolicyState: would still have to iterate over all elements while populating policyArr which alone has a performance of n^2. Line 19 and 20 would both exit in 1 and 2 operations respectively though.
 * getBlockPolicyStateRefactor: Although still O(n) because of the use of Object.values, the forEach loop would return on its second iteration.
 * 
 * Improvements
 * - I cant think of a way to improve upon O(n) while the input is an object as it requires an O(n) operation to make it iterable. 
 * - If it was an array and was sorted by domains.policy i think it would be possible to perform a binary search and improve the time complexity to O(log(n)). 
 * Improving on this - if there are only 2 possibilities of "block" or "none", it would only be neccessary to check the first and last 
 * index of the sorted array. From this you could deduce the output variables. This would reduce the complexity even further to constant time: Time: O(1), Space: O(1)
 */


console.log(`getBlockPolicyState: ${JSON.stringify(getBlockPolicyState(domains), null, 4)}`)
console.log(`getBlockPolicyStateImproved: ${JSON.stringify(getBlockPolicyStateRefactor(domains), null, 4)}`)

