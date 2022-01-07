import React, { useEffect } from "react";
/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter(ref) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    //remove normal tooltips after activate demo mode
    const removeClass = (className) => {
      let tooltip = document.getElementsByClassName(className);
      if (tooltip) {
        for (var ele of tooltip) {
          ele.classList.add("d-none");
          ele.classList.remove("show");
        }
      }
    };
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        removeClass("dln-poppver-tooltip");
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
