[](../src/requirements/)

Written by devsam
[Original GitHub Issue + more context](https://github.com/cornell-dti/course-plan/issues/522)

## Background

There are concerns over the current too liberal approach of computing requirement as proposed in the original plan above. In the previous proposal, we keep all edges by default even if there is double-counting and let user opt-out of those edges later.

As a response to that, we have explored ideas that the edges are not added by default. Instead, the user has to explicitly do opt-in for courses that might introduce double counting. This proposal indeed ensures that we are conservative about progress computation, but it also makes certain things hard to explain to users:

- why user has to make choices
- how to find potential constraint violation because an edge is added
- how to inform user about making choices without exposing all the graph internals

## Amendament Solution

It turns out that we can try to find the best of both worlds by computing two graphs. The first graph is the graph we will compute according to the original proposal above. It will keep all edges, and user choices to remove double counting will be represented as opt-out. (Phase 3 computation). Then based on the graph, we remove all the edges that are associated with constraint violation, which results in a graph that only contain safe edges (Phase 4 computation).

Both graphs will be useful. Phase 3 graph helps us to compute constraint violations that can be used as source of suggestions and warnings for users, and phase 4 graph provides a source for progress computation that is conservative and safe.

## Example

Consider the following example before we account for user choices. By default, all edges are kept, even if there are constraint violations (i.e. double counting).

 <img alt="Screen Shot 2021-11-02 at 21 47 33" width="479" src="https://user-images.githubusercontent.com/4290500/140000569-e90c641c-0465-4cdf-883a-6188b7ff22eb.png">
 
 Then we start to take account of user choices. In this case, the user opts-out the edge `CS5414 --- MEng_CS_15_Credits`. Now we get a graph that on the left of the following figure.
 
 <img alt="Screen Shot 2021-11-02 at 21 47 42" width="1255" src="https://user-images.githubusercontent.com/4290500/140000571-e52d000b-740b-4a98-b2b2-4da948d6b11d.png">
 
 This graph still has constraint violations (edges marked in red), so we remove all the edges that are associated with constraint violations and obtain the graph on the right. The graph on the right will then by the source of truth for computing fulfillment progress.
