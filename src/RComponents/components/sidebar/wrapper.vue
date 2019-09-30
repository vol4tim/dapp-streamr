<script>
export default {
  name: "wrapper",
  functional: true,
  props: {
    l_class: String,
    l_wrap: String,
    l_props: Object
  },
  // render: function(createElement, context) {
  //   console.log('Rendering Foo')
  //   return createElement({
  //     template: context.props.foo
  //   }, context.data)
  // }
  render(h, { children, props, data }) {
    // console.log(children, props, data);
    children = children.map(child => {
      // console.log(child, props, data);
      // if (child.componentInstance._uid === props.l_props.block) {
      // return h(props.l_wrap, { props: props.l_props }, [child], child.data);
      // }
      return h(props.l_wrap, []);
    });
    // if (props.l_class) {
    //   children.forEach(child => {
    //     if (!child.data) child.data = {};
    //     if (child.data.staticClass) {
    //       child.data.staticClass += " " + props.l_class;
    //     } else {
    //       child.data.staticClass = props.l_class;
    //     }
    //   });
    // }
    // if (props.l_wrap) {
    //   children = children.map(child => {
    //     console.log(props.l_props);
    //     return h(props.l_wrap, { props: props.l_props }, [child]);
    //   });
    // }
    return children;
  }
};
</script>
