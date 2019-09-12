# **rating-frontend**
Front-end for the rating stack, it is powered by vueJS and chartJS.
Fed by our [API](https://git.rnd.alterway.fr/overboard/5gbiller/rating-api/tree/master), it is used as a lightweight vizualisation solution to follow the evolution of the rating of your metrics.

## Usage

The frontend can be exposed with the following command:

```
# Expose the frontend
podname=$(kubectl get pods -l app.kubernetes.io/name=rating,app.kubernetes.io/component=frontend -o name | cut -d/ -f2 | head -1)
kubectl port-forward "$podname" 8080:8080 --v=10
```

After running these commands, access it at `localhost:8080`

You can also expose the app via `kubectl proxy`, the url will then be:

`http://localhost:8001/api/v1/namespaces/<yourNamespace>/services/<podName>:80/proxy/`