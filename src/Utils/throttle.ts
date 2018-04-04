export function throttle(callback: Function, limit: number, skip=false) {
    var wait = false;                  // Initially, we're not waiting
    let run1 = skip;
    return function () {               // We return a throttled function
        if (!wait) {                   // If we're not waiting
            if (!skip)
                callback.apply(null, arguments);           // Execute users function
            skip = false;
            wait = true;               // Prevent future invocations
            setTimeout(function () {   // After a period of time
                wait = false;          // And allow future invocations  
                if (run1) {
                    run1 = false;
                    callback.apply(null, arguments);
                }
            }, limit);
        } else {
            run1 = true;
        }
    }
}
export default throttle;