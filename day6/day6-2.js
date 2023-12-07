// turn input into object records 
// note: distance = speed * ( Time - loadtime) = loadTime * (Time-loadTime) = - loadTime^2 + Time * loadTime 
//        
// for each record
//    find the earliest loadTime where loadTime * (Time-loadTime) > distance  ( solve -t^2 + t*B - C=0 for B = Time and C = Distance and round up)
//    find the last loadTime where loadTime * (Time-loadTime) > distance (idem, round down)
//    (-b + sqrt(b^2 - 4ac))/2a
//    [B/2 - sqrt(B**2 - 4*C)/2, B/2 + sqrt(B**2 - 4*C)/2] -  B = Time and C = Distance and round down

function solveQuadratic(a, b, c) {
    // Calculate the discriminant
    const discriminant = b * b - 4 * a * c;

    // Check if discriminant is negative
    if (discriminant < 0) {
        return "No real solutions";
    }

    // Calculate two solutions
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    // Check for a single solution (when discriminant is zero)
    if (discriminant === 0) {
        return `One solution: x = ${x1}`;
    }

    // Return two solutions
    return [x1, x2];
}


const produceResult = () => {
    const records = { Time: inputDoc.Time.split(' '), Distance: inputDoc.Distance.split(' ') }
    console.log(`records ${JSON.stringify(records)}`)
    let solutionTotal = 1
    for (let i = 0; i < records.Time.length; i++) {
        const solutions = solveQuadratic(-1, records.Time[i], -records.Distance[i])
        solutions[0] = Math.trunc(solutions[0]+0.0000000001) + 1
        solutions[1] = Math.trunc(solutions[1]-0.0000000001)
        const numberOfSolutions = solutions[1] - solutions[0] + 1
        console.log(`number of solutions ${numberOfSolutions}`);
        solutionTotal*= numberOfSolutions
    }
    console.log(`product of numbers of solutions ${solutionTotal}`);

}

const inputDoc2 = {
    Time: `71530`
    , Distance: `940200`
}

const inputDoc = {
    Time: `41667266`
    , Distance: `244104712281040`
}


produceResult()