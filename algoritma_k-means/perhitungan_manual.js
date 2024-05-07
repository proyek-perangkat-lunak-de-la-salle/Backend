/**
 * KMeans is a class for performing K-Means clustering.
 */
class KMeans {
  /**
   * The constructor for the KMeans class.
   * @param {number} k - The number of clusters.
   * @param {Array} data - The data to be clustered.
   * @param {number} maxIterations - The maximum number of iterations for the algorithm.
   * @param {Array} names - The names of the clusters.
   */
  constructor(k, data, maxIterations, names) {
    this.k = k;
    this.data = data;
    this.maxIterations = maxIterations;
    this.names = names;
    this.centroids = this.data.slice(0, this.k);
  }

  /**
   * Calculates the Euclidean distance between two points.
   * @param {Array} point1 - The first point.
   * @param {Array} point2 - The second point.
   * @returns {number} The Euclidean distance between the two points.
   */
  euclideanDistance(point1, point2) {
    if (point1 === null || point2 === null) return Infinity;
    return Math.sqrt(
      point1.reduce((acc, val, i) => acc + Math.pow(val - point2[i], 2), 0)
    );
  }

  /**
   * Checks if the algorithm has converged.
   * @param {Array} oldCentroids - The centroids from the previous iteration.
   * @param {Array} newCentroids - The centroids from the current iteration.
   * @param {number} epsilon - The convergence threshold.
   * @returns {boolean} True if the algorithm has converged, false otherwise.
   */
  checkConvergence(oldCentroids, newCentroids, epsilon = 0.0001) {
    return oldCentroids.every((oldCentroid, index) => {
      return this.euclideanDistance(oldCentroid, newCentroids[index]) < epsilon;
    });
  }

  /**
   * Performs the K-Means clustering algorithm.
   * @returns {Object} An object containing the final centroids, the clusters, and the number of iterations.
   */
  fit() {
    let converged = false;
    let iterations = 0;
    let clusters = Array.from({ length: this.k }, () => []);

    while (!converged && iterations < this.maxIterations) {
      clusters = Array.from({ length: this.k }, () => []);

      for (let point of this.data) {
        let distances = this.centroids.map((centroid) =>
          this.euclideanDistance(point, centroid)
        );
        let closestCentroidIndex = distances.indexOf(Math.min(...distances));
        clusters[closestCentroidIndex].push(point);
      }

      let newCentroids = clusters.map((cluster) => {
        if (cluster.length === 0)
          return this.centroids[clusters.indexOf(cluster)];
        let sum = cluster.reduce(
          (acc, val) => acc.map((x, i) => x + val[i]),
          Array(this.data[0].length).fill(0)
        );
        return sum.map((x) => x / cluster.length);
      });

      converged = this.checkConvergence(this.centroids, newCentroids);

      this.centroids = newCentroids;
      iterations++;
    }

    let namedClusters = {};
    clusters.forEach((cluster, index) => {
      namedClusters[this.names[index]] = cluster;
    });

    return { centroids: this.centroids, clusters: namedClusters, iterations };
  }
}

// Sample data for clustering
const data = [
  [1, 1, 1, 2, 1, 2, 2, 1],
  [2, 2, 3, 2, 2, 3, 3, 2],
  [3, 2, 3, 2, 2, 1, 1, 1],
  [2, 2, 4, 2, 1, 2, 2, 2],
  [2, 2, 2, 1, 1, 3, 3, 3],
  [3, 3, 3, 3, 1, 1, 1, 1],
  [3, 3, 2, 2, 2, 2, 2, 2],
  [1, 1, 1, 1, 2, 3, 3, 3],
  [2, 2, 4, 3, 1, 1, 1, 1],
  [2, 2, 4, 2, 2, 2, 2, 2],
];

// Number of clusters
const k = 3;

// Maximum number of iterations
const maxIterations = 100;

// Names of the clusters
const names = ["rendah", "sedang", "tinggi"];

// Create a new KMeans object
const kmeans = new KMeans(k, data, maxIterations, names);

// Perform the clustering
const result = kmeans.fit();

// Print the results
console.log("Centroids:", result.centroids);
console.log("Iterations:", result.iterations);
console.log("Clusters:", result.clusters);
