// Task 1
// Find the first recurring character of the following lists and analyze the runtime vs space trade-off of your solution

const task1 = [
 [2,5,1,2,3,5,1,2,4], // Should return 2
 [2,1,1,2,3,5,1,2,4], // Should return 1
 [2,3,4,5], // Should return undefined
 [2,5,5,2,3,5,1,2,4] // Should return 5
]

const findRecurring = nums => { // size of nums referred to as (n)
    const map = {} // worst case, this map will grow to the size of nums. Time: (1), Space: (n)

    for(let i = 0; i < nums.length; i++) { // worst case - iterates over entire length of input nums. Time: (n)
        if(map[nums[i]]) { // constant (1)
            return nums[i]
        }
        map[nums[i]] = true // constant. (1)
    }

    return undefined // constant (1)
}

/**
 * The worst case for this algorithm is that entire length of nums is iterated over and no match is found / or match is found in the last element of the array.
 * - (nums) is represented as (n)
 * 
 * Worst case: 
 * Time complexity: O(n) or before discarding: O(2n + 2)
 * Space complexity: O(n)
 */

task1.forEach((task, i) => {
    console.log(`Task ${i}: ${findRecurring(task)}`)
})