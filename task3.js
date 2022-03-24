// Task 3
// Analyse the following code, explain what it is doing, what problems you can find / suggestions for improvement.

import expensiveOperation from "./libs";

const input = {
  // Example to provide data shape only
  request: {
    url: "/api/domain_analyzer",
    method: "POST",
    body: {
      domains: [
        "microsoft.com",
        "outlook.com",
        "three.com",
        "four.com",
        "redsift.com",
      ],
    },
  },
  db_data: [
    {
      domains: [
        {
          key: "b25lLmNvbQ==",
          value: '{"dom":"microsoft.com","dt":"10-11-2021","org":"ms"}',
        },
        {
          key: "Zml2ZS5jb20=",
          value: '{"dom":"redsift.com","dt":"12-11-2021","org":"redsift"}',
        },
      ],
    },
    {
      users: [
        {
          key: "b25lLmNvbQ==/dHdvLmNvbQ==",
          value: '{"u":"jane@microsoft.com"}',
        },
        { key: "Zml2ZS5jb20=/dHdvLmNvbQ==", value: '{"u":"john@redsift.com"}' },
      ],
    },
  ],
};

/**
 * Description: Calls expensiveOperation for each domain in request.body.domains with the parsed matching value in db_data[?].domains. Results are cached indefinately 
 * and subsequent calls to expensiveOperation with the same domain name return the previous results, regardless of whether the domain.value has changed.
 * 
 * Returns 204 with a payload containing the computed / cached results for each domain. Record<string, ReturnType<typeof expensiveOperation>>
 */

/**
 * The below line looks like its acting as a form of cache. The lifetime of this would be the lifetime of the node process. Also, it wouldnt detect when any value in domain.value changes likely resulting in some issues.
 * Suggestion: remove this and memoise  and cache expensiveOperation based on the stringified domain.value. ie, the keys "dom", "dt", "org". 
 */
const PREVIOUS = {}; 

const compute = async (input, apiResponse) => { // Suggestion: Meaningful function name.
  const { url, body } = input.request;
  if (url === "/api/domain_analyzer") {
    const r = {}; // I understand this is the (r)esponse, but i would still advocate for a more descriptive variable name. Suggestion: Meaningful variable name

    /**
     * If db_dd is moved out of the below function, it might be simpler to iterate over that instead and avoid iterating over body.domains alltogether. 
     * If required a check can be performed to ensure each domain in body.domains exists in db_data[?].domains
     */
    body.domains.forEach(async (d) => { // forEach wont await. expensiveOperation will be called multiple time asynchronously potentially overloading a service more than intended. Suggestion: use a for ... of loop. Meaningful variable name
      const db_d = input.db_data.find((d) => "domains" in d); // .find will return the first match. Will domains always exist?. Suggestion: Meaningful variable name and clarification on whether this could return undefined
      const db_dd = {}; // Suggestion: Meaningful variable name


      /**
       * The below forEach is being performed per domain when it only needs to be once.
       * Suggestion: Move outside and above forEach loop to improve performance
       */
      db_d["domains"].forEach((i) => { // Suggestion: Meaningful variable name. The object is "domains" (plural) so probably "domain". Alternatively, destructure "value". Clarification: Not going to be trying to index into "undefined"
        const v = JSON.parse(i.value); 
        /**
         * It looks like below is constructing an object (db_dd) where the key is the "value.dom" property, and the value the parsed "value" property. But personally, i found this a little difficult to read. 
         * Suggestion: Meaningful variable names, break apart slightly and perhaps assign the key to a variable first
         */
        db_dd[v["dom"]] = v; 
      });

      /**
       * Suggestion for below: referring to above comment - remove below code and assign memoised expensiveOperation to the response
       */
      if (PREVIOUS[d]) { 
        r[d] = PREVIOUS[d];
      }
      else {
        /**
         * This is telling me that for every domain (x) in request.body.domains, there will exist an entry in db_data[?].domains where the parsed(value.dom) property matches (x). 
         * Suggestion: I would probably add some checks to make sure db_dd[d] wasnt undefined and throw appropriate warnings / errors if this occured. The same applies for the inverse where
         * a request.body.domains was missing a domain found in db_data[?].domains.
         * It might be better to perform this validation logic before calling the compute function altogether, or alternatively use suggestion above and just iterate over db_dd
         */
        r[d] = await expensiveOperation(d, db_dd[d]); 
        PREVIOUS[d] = r[d];
      }
    });
    return apiResponse(204, r); // It appears as if the payload is being returned including all the computed data from the expensiveOperation function. Would 200 be more appropriate here? Suggestion: Change status code to 200
  }
};
