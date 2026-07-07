---
published: false
title: 'Virtualizing Responsive Grid Layouts Without Binary Search or Estimated Item Heights'
cover_image: 'https://raw.githubusercontent.com/itihon/layout-virtual/main/homepage/src/assets/simplescreenrecorder-2026-07-06_15.08.42-ezgif.com-optimize.gif'
description: 'An alternative approach to virtualizing dynamic lists and responsive grids.'
tags: webdev, react, vue, angular
series:
canonical_url:
---

In this article I'd like to share my approach to virtualizing lists with items of unknown height. Most existing virtualization libraries solve this problem by estimating item sizes, measuring the rendered elements, and continuously correcting those estimates as more information becomes available.

Here I'd like to describe a method that takes a different approach. Instead of relying on accumulated item offsets, it maps item indices directly to the scrollbar position. This makes it possible to determine the visible range with good accuracy without knowing — even approximately — the sizes of all preceding items, using only simple math and the browser's native layout and positioning mechanics.

Live demos in TypeScript, React, Vue, and Angular are available at the [Layout Virtual homepage](https://itihon.github.io/layout-virtual/).
 
Source code: [github.com/itihon/layout-virtual](https://github.com/itihon/layout-virtual)

## The Traditional Approach

Let's start with the simplest case — a list where every item has the same **fixed height**. To find the start of the visible range, divide `scrollTop` by item height — that gives you the number of scrolled-past items (the start index). Likewise, determining how many items are needed to fill the viewport is straightforward: divide the viewport height by the item height.

Things become slightly more complicated when item **heights are different** but known in advance. In this case, the list must first be traversed to build an array of cumulative offsets (the prefix sums of all preceding item heights), an `O(N)` operation. Once this preprocessing is complete, the visible range can be quickly found during scrolling in `O(log N)` time using binary search. The initial preprocessing can be optimized by spreading the work across multiple animation frames to avoid blocking the UI. Another common optimization is lazy evaluation — only computing offsets up to where the user has actually scrolled.

It gets even more interesting when the items have completely unknown, **dynamic heights** — items whose height depends on content, and which can change when the viewport resizes and text reflows. If the previous method relied on known heights to calculate offsets, what do we do when those heights are unknown? The common workaround is to pick an "estimated" height, and then, as the user scrolls, measure the actual sizes of the rendered elements (for example, using `ResizeObserver`), and continuously correct the accumulated offsets as scrolling progresses.

What if we could sidestep all of that?

## The Core Idea

Instead of anchoring the visible range to absolute item heights (which are unknown), we can **anchor item indices to scroll percentage**.

Imagine a list of 110 items, viewport height 100px, each item 10px tall. In this example:

- when the scrollbar is at 0%, item 0 is at the top of the viewport;
- at 25%, item 25 is at the top;
- at 50%, item 50 is at the top;
- at 75%, item 75 is at the top;
- and finally, at 100%, item 100 reaches the top of the viewport.

For the sake of clarity, I've deliberately picked dimensions and quantity here so that the scroll percentage perfectly maps to the index of the first visible element.

![example](./assets/article_layout_virtual_0.png)

Here is a [link to the example](https://v49.livecodes.io/?x=id/8j6kgdwbdvk) to make it easier to visualize.

From this example, we can derive the following relationship:

```
viewportTopIndex / (itemsCount - viewportItemCount) = scrollTop / (scrollHeight - clientHeight)
```

> The first visible index relates to the total number of scrollable items the same way scroll position relates to the total scroll range.

But in a dynamic list, how can we possibly know how many elements (`viewportItemCount`) will fit into the viewport?

## Anchor Points

Suppose there exists an item whose index corresponds to the current scrollbar position. This item doesn't necessarily have to be the first visible one — it can be anywhere inside the visible range. If we remove the unknown terms from the previous equation, we are left with a direct ratio: an item's index relative to the total item count equals the current scroll percentage:

```
index / itemsCount = scrollTop / (scrollHeight - clientHeight)
```

This specific index, which resides somewhere within the visible range, will serve as our **anchor**. Its physical position inside the viewport is determined by the **viewport's anchor point**, calculated by multiplying the scroll percentage (the right side of the formula above) by the viewport height:

```
viewportAnchor = scrollTop / (scrollHeight - clientHeight) * clientHeight
```

As the scrollbar moves toward the top, the anchor point approaches the top of the viewport. As it moves toward the bottom, the anchor point shifts toward the bottom. At 50%, the anchor point is exactly in the middle of the viewport.

Now, to determine the precise position of this anchor element within the visible area, let's derive the index from our formula:

```
anchorIndex = scrollTop / (scrollHeight - clientHeight) * itemsCount
```

Using our previous 110-item example, let's calculate the anchor index at a 25% scroll position:

```
0.25 * 110 = 27.5 (where 27 is the index, and 0.5 represents 50% of the element's height)
```

The fractional remainder (0.5) in this result tells us the exact percentage of its own height that this element must be shifted above the viewport's anchor point. 

> In other words, at 25% scroll position, the element with index 27 will sit exactly half its height above the anchor point — which itself is positioned 25% of the viewport height below the top edge of the viewport.

If we change the total item count in our example from 110 to exactly 100, the elements that used to be the first visible items now become the anchors themselves. Meaning:

- 0% scroll - index 0
- 25% scroll - index 25
- 50% scroll - index 50
- ...and so on.

---

> Essentially, this anchor element's height is the only height that needs to be measured in real time to determine the position of all visible elements. There's no need to know the absolute or even approximate sizes of all the other elements. Consequently, there is no need to maintain cumulative offset arrays, perform binary searches, or deal with complex range tree data structures.
>
> The entire task boils down to rendering a range of elements that encompasses the anchor item, and then positioning that entire range so that the anchor aligns perfectly with the viewport's current anchor point. In other words, we keep the scrollbar and the indices synchronized so that both sides of our first formula remain perfectly equal. If this ratio is maintained, the physical scrollbar and the virtual elements will always converge at the beginning and the end of the list regardless of the actual heights of the elements.

To achieve this, we need to decouple the scrollbar from the scroll canvas so that the elements move natively along with the canvas while the scrollbar independently reflects the progression of item indices.

There's one more challenge. Responsive Grid layout implies rendering elements in normal document flow — without wrappers, transformations (`transform: translate(...)`), or absolute positioning. This means adding or removing elements at the top of the visible range will cause a layout shift that pushes the rest of the content around, which we must compensate for. While it is easy to calculate this shift when scrolling down (since the heights of the elements being removed from the top are already known), how do we handle adding elements of completely unknown heights to the top when a user scrolls up?