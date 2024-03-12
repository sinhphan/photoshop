declare namespace DESIGN {
  type Layer = {
    id: string;
    type: string;
    title: string;
    width?: number;
    height?: number;
    image: string;
    metadata: {
      file?: File,
      object?: fabric.Object
    }
  }

  type Config = {
    color: string;
    placement: string;
    color_code: string;
    zoom: number;
    currentMenu: string;
  }

  type Template = {
    image_url: string,
    orientation: string,
    template_id: number,
    printfile_id: number,
    background_url: string,
    print_area_top: number,
    template_width: number,
    print_area_left: number,
    template_height: number,
    background_color: string,
    print_area_width: number,
    print_area_height: number,
    is_template_on_front: boolean
  }
}